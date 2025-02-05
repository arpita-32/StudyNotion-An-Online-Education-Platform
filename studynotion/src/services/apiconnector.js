import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1", // Set a base URL for all requests
  headers: {
    "Content-Type": "application/json", // Default headers
  },
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: headers ? { ...axiosInstance.defaults.headers, ...headers } : axiosInstance.defaults.headers,
    params: params ? params : null,
  });
};