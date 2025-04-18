import { toast } from "react-hot-toast";
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useElements } from '@stripe/react-stripe-js';
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

// Initialize Stripe outside the function to avoid multiple initializations
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Helper function to check if token is valid
const isTokenValid = (token) => {
  return token && typeof token === 'string' && token.length > 0;
};
export async function buyCourse(token, courses, userDetails, navigate, dispatch, elements) {
  const toastId = toast.loading("Processing payment...");
  
  try {
    // 1. Validate inputs
    if (!token || !courses || !userDetails || !elements) {
      throw new Error("Missing required payment information");
    }

    // 2. Initialize Stripe
    const stripe = await stripePromise;
    if (!stripe) throw new Error("Stripe failed to initialize");

    // 3. Get CardElement
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) throw new Error("Card details not found");

    // 4. Create payment intent
    const orderResponse = await apiConnector(
      "POST", 
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse?.data?.success) {
      throw new Error(orderResponse?.data?.message || "Payment failed");
    }

    // 5. Confirm payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      orderResponse.data.clientSecret, 
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${userDetails.firstName} ${userDetails.lastName}`.trim(),
            email: userDetails.email,
          },
        },
      }
    );

    if (error) throw error;
    if (paymentIntent.status !== 'succeeded') {
      throw new Error("Payment not completed");
    }

    // 6. Verify payment
    await verifyPayment(
      {
        paymentIntentId: paymentIntent.id,
        courses
      }, 
      token, 
      navigate, 
      dispatch
    );

  } catch (error) {
    console.error("Payment error:", error);
    toast.error(error.message || "Payment failed");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    // Check token validity
    if (!isTokenValid(token)) {
      console.warn("Invalid token when sending success email");
      return;
    }
    
    await apiConnector(
      "POST", 
      SEND_PAYMENT_SUCCESS_EMAIL_API, 
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      }, 
      {
        Authorization: `Bearer ${token}`
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    // We don't throw here as this is a non-critical operation
  }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment....");
  dispatch(setPaymentLoading(true));
  
  try {
    // Check token validity
    if (!isTokenValid(token)) {
      throw new Error("Invalid authentication token. Please login again.");
    }
    
    const response = await apiConnector(
      "POST", 
      COURSE_VERIFY_API, 
      bodyData, 
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Payment verification failed");
    }
    
    toast.success("Payment Successful, you are added to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    
    if (error.response?.status === 401) {
      toast.error("Authentication failed. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      toast.error("Could not verify payment: " + (error.message || "Unknown error"));
    }
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}