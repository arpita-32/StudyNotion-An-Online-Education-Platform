
import { toast } from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}


export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Processing payment...");
  try {
      // 1. Load Razorpay script
      const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!isScriptLoaded) {
          throw new Error("Razorpay SDK failed to load");
      }

      // 2. Create payment order with better error handling
      const orderResponse = await apiConnector(
          "POST", 
          COURSE_PAYMENT_API,
          { courses },
          {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          }
      );

      console.log("Full order response:", orderResponse); // Debug log

      // 3. Validate response structure
      if (!orderResponse?.data?.success || !orderResponse.data.data) {
          const errorMsg = orderResponse?.data?.message || 
                         "Invalid payment order response from server";
          throw new Error(errorMsg);
      }

      // 4. Extract payment details with fallbacks
      const paymentOrder = orderResponse.data.data;
      const currency = paymentOrder.currency || "INR";
      const amount = paymentOrder.amount;
      const orderId = paymentOrder.id;

      if (!amount || !orderId) {
          throw new Error("Missing required payment details from server");
      }

      // 5. Setup Razorpay options
      const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: amount.toString(),
          currency,
          order_id: orderId,
          name: "StudyNotion",
          description: "Course Enrollment",
          image: rzpLogo,
          prefill: {
              name: `${userDetails.firstName} ${userDetails.lastName}`.trim(),
              email: userDetails.email,
          },
          handler: async function(response) {
              try {
                  await sendPaymentSuccessEmail(response, amount, token);
                  await verifyPayment({...response, courses}, token, navigate, dispatch);
              } catch (error) {
                  console.error("Post-payment processing error:", error);
                  toast.error("Payment completed but processing failed");
              }
          },
          theme: {
              color: "#61dafb"
          }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", (response) => {
          console.error("Payment failed:", response.error);
          toast.error(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();

  } catch (error) {
      console.error("Payment error details:", {
          error: error.toString(),
          stack: error.stack,
          response: error.response?.data
      });

      let errorMessage = "Payment processing failed";
      
      if (error.message.includes("401")) {
          errorMessage = "Session expired. Please login again";
          // Optionally redirect to login
          // navigate("/login");
      } else if (error.message.includes("Network Error")) {
          errorMessage = "Network connection failed. Please check your internet.";
      }

      toast.error(errorMessage);
  } finally {
      toast.dismiss(toastId);
  }
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, ypou are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}
