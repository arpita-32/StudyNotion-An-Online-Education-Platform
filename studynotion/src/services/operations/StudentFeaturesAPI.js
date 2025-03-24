import { toast } from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
import { loadStripe } from '@stripe/stripe-js';

const { COURSE_PAYMENT_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Loading...");
  try {
    // Load Stripe
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    
    // Initiate the payment session
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

    if (!sessionResponse.data.success) {
      throw new Error(sessionResponse.data.message);
    }

    // Redirect to Stripe checkout
    const result = await stripe.redirectToCheckout({
      sessionId: sessionResponse.data.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    // If we get here, the redirect was successful
    // The actual verification will happen via webhook
    toast.success("Redirecting to payment...");

  } catch (error) {
    console.log("PAYMENT API ERROR.....", error);
    toast.error(error.message || "Could not initiate payment");
  }
  toast.dismiss(toastId);
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
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
  }
}

// This function will be called from the webhook handler in your backend
export async function handleStripePaymentSuccess(paymentData, token, navigate, dispatch) {
  const toastId = toast.loading("Processing payment...");
  dispatch(setPaymentLoading(true));
  try {
    // Verify payment with backend
    const response = await apiConnector(
      "POST", 
      "/payment/verify-stripe", 
      paymentData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful, you are added to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    toast.error("Could not verify Payment");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}