import axios from "axios";

// it is used to create a new instance of axios with a base URL
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, //send cookies with the request
});
