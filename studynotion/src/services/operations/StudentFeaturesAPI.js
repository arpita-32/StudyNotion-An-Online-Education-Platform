import { toast } from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
import { loadStripe } from '@stripe/stripe-js';

const { COURSE_PAYMENT_API, SEND_PAYMENT_SUCCESS_EMAIL_API, VERIFY_PAYMENT_API } = studentEndpoints;

// Stripe initialization outside the function to avoid multiple initializations
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Processing payment...");
  try {
    // Validate input
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      throw new Error("No courses selected for purchase");
    }

    if (!userDetails?._id) {
      throw new Error("User information missing");
    }

    dispatch(setPaymentLoading(true));

    // Initialize Stripe
    const stripe = await getStripe();
    
    // Create checkout session
    const sessionResponse = await apiConnector(
      "POST", 
      COURSE_PAYMENT_API, 
      {
        products: courses,
        userId: userDetails._id
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!sessionResponse?.data?.success) {
      throw new Error(sessionResponse?.data?.message || "Payment session creation failed");
    }

    // Redirect to Stripe checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionResponse.data.id,
    });

    if (error) {
      throw new Error(error.message || "Redirect to payment failed");
    }

  } catch (error) {
    console.error("PAYMENT ERROR:", error);
    toast.error(error.message || "Payment processing failed");
    // Don't dismiss toast here - let the finally block handle it
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}

export async function handleStripePaymentSuccess(paymentData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying payment...");
  try {
    dispatch(setPaymentLoading(true));

    // Verify payment with backend
    const verificationResponse = await apiConnector(
      "POST", 
      VERIFY_PAYMENT_API, 
      paymentData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!verificationResponse?.data?.success) {
      throw new Error(verificationResponse?.data?.message || "Payment verification failed");
    }

    // Send confirmation email
    try {
      await sendPaymentSuccessEmail(
        verificationResponse.data,
        paymentData.amount,
        token
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't throw - payment succeeded even if email fails
    }

    // Update UI state
    toast.success("Payment verified successfully!");
    dispatch(resetCart());
    navigate("/dashboard/enrolled-courses");

  } catch (error) {
    console.error("PAYMENT VERIFICATION ERROR:", error);
    toast.error(error.message || "Payment verification failed");
    // Consider redirecting to a failure page or showing retry options
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST", 
      SEND_PAYMENT_SUCCESS_EMAIL_API, 
      {
        orderId: response.orderId,
        paymentId: response.paymentId,
        amount,
      },
      {
        Authorization: `Bearer ${token}`
      }
    );
  } catch (error) {
    console.error("PAYMENT SUCCESS EMAIL ERROR:", error);
    throw error; // Let the caller handle this
  }
}