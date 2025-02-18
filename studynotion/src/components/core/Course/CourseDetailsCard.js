import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../slices/cartSlice";

const CourseDetailsCard = ({ course, setConfirmationModal }) => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart } = useSelector((state) => state.cart);

    const handleBuyCourse = async () => {
        if (token && user.accountType === "Student") {
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

            const body = {
                products: [{ ...course }],
                userId: user._id,
            };

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const session = await response.json();

            if (session.id) {
                const result = await stripe.redirectToCheckout({ sessionId: session.id });

                if (result.error) {
                    console.error(result.error);
                }
            } else {
                console.error("Failed to retrieve session ID");
            }
        } else {
            setConfirmationModal(true);
        }
    };

    return (
        <div>
            <button onClick={handleBuyCourse}>Buy Now</button>
        </div>
    );
};

export default CourseDetailsCard;
