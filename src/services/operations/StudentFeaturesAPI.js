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
    // Validate token before proceeding
    if (!isTokenValid(token)) {
      throw new Error("Invalid authentication token. Please login again.");
    }

    // 1. Get Stripe instance
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error("Stripe failed to initialize");
    }

    // 2. Create payment intent with proper authentication
    const orderResponse = await apiConnector(
      "POST", 
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    // 3. Validate response
    if (!orderResponse?.data?.success || !orderResponse.data?.clientSecret) {
      const errorMsg = orderResponse?.data?.message || 
                     "Invalid payment intent response from server";
      throw new Error(errorMsg);
    }

    const { clientSecret } = orderResponse.data;
    
    // 4. Confirm payment with Stripe
    if (!elements) {
      throw new Error("Stripe elements not found");
    }
    
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${userDetails.firstName} ${userDetails.lastName}`.trim(),
          email: userDetails.email,
        },
      },
      receipt_email: userDetails.email,
    });

    if (error) {
      throw error;
    }

    if (paymentIntent.status === 'succeeded') {
      // 5. Send payment success email
      await sendPaymentSuccessEmail(
        {
          razorpay_order_id: paymentIntent.id,
          razorpay_payment_id: paymentIntent.id,
        }, 
        paymentIntent.amount / 100, // Convert back to currency units from cents
        token
      );

      // 6. Verify payment with backend
      await verifyPayment(
        {
          razorpay_order_id: paymentIntent.id,
          razorpay_payment_id: paymentIntent.id,
          razorpay_signature: '', // Not needed for Stripe
          courses
        }, 
        token, 
        navigate, 
        dispatch
      );
    }

  } catch (error) {
    console.error("Payment error details:", {
      error: error.toString(),
      stack: error.stack,
      response: error.response?.data
    });

    let errorMessage = "Payment processing failed";
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      errorMessage = "Authentication failed. Please login again.";
      // Clear auth state and redirect to login
      localStorage.removeItem("token"); // If using localStorage
      setTimeout(() => navigate("/login"), 2000);
    } else if (error.code === 'card_declined') {
      errorMessage = `Your card was declined: ${error.message}`;
    } else if (error.message.includes("Network Error")) {
      errorMessage = "Network connection failed. Please check your internet.";
    } else {
      errorMessage = error.message || "Payment failed";
    }

    toast.error(errorMessage);
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