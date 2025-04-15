import { toast } from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function buyCourse(token, courseId, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Processing payment...");
    
    try {
      // Verify token exists
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      // Load Razorpay script
      const razorpayLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
  
      if (!razorpayLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }
  
      // Create order
      const orderResponse = await apiConnector(
        "POST",
        COURSE_PAYMENT_API,
        { courses: [courseId] },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      );
  
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Failed to create payment order");
      }
  
      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        currency: orderResponse.data.data.currency,
        amount: orderResponse.data.data.amount,
        order_id: orderResponse.data.data.id,
        name: "StudyNotion",
        description: "Course Purchase",
        image: rzpLogo,
        prefill: {
          name: `${userDetails.firstName} ${userDetails.lastName}`,
          email: userDetails.email
        },
        handler: async function(response) {
          try {
            await sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
            await verifyPayment({ 
              ...response, 
              courses: [courseId] 
            }, token, navigate, dispatch);
          } catch (error) {
            console.error("Payment handler error:", error);
            toast.error("Payment verification failed");
          }
        }
      };
  
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function(response) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });
  
      paymentObject.open();
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error(error.message || "Payment processing failed");
    } finally {
      toast.dismiss(toastId);
    }
  }

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
  }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment....");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

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