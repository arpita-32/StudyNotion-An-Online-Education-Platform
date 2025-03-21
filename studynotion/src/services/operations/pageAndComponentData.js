import { apiConnector } from "../apiconnector";
import { catalogData } from "../api";
import toast from 'react-hot-toast';

export const getCatalogData = async (categoryId) => {
    const toastId = toast.loading('Loading...');
    try {
        // Input validation
        if (!categoryId) {
            toast.error("Category ID is required");
            return null;
        }

        console.log("Fetching catalog data for category ID:", categoryId);
        
        const response = await apiConnector('POST', catalogData.CATALOGPAGEDATA_API, { categoryId });

        console.log('API Response Status:', response.status);
        
        // Check if the response contains data
        if (!response || !response.data) {
            throw new Error("Empty response received from the server");
        }

        console.log('Response from the category page detail API:', response.data);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch catalog data");
        }

        return response.data.data;
    } catch (err) {
        console.error("Error in getCatalogData function:", err);
        
        // More detailed error logging
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Server responded with error:", err.response.status);
            console.error("Error data:", err.response.data);
            toast.error(err.response.data.message || "Server error occurred");
        } else if (err.request) {
            // The request was made but no response was received
            console.error("No response received from server");
            toast.error("No response from server. Please check your connection.");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", err.message);
            toast.error("Error setting up request: " + err.message);
        }
        
        return null;
    } finally {
        toast.dismiss(toastId);
    }
};