import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";
// it is used to create a new instance of axios with a base URL
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, //send cookies with the request
});
