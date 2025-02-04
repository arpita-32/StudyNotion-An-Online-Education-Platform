import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
};

// Example usage with authentication token
const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

apiConnector('POST', 'http://localhost:4000/api/v1/auth/sendotp', { email: 'user@example.com' }, headers)
    .then(response => {
        console.log('OTP sent successfully:', response.data);
    })
    .catch(error => {
        console.error('Error sending OTP:', error);
    });