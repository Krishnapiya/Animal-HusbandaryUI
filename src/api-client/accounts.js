//import axios from "axios";
import {
  LOGIN_API_URL,
  // LOGOUT_API_URL,
  //  USER_VALIDITY_CHECK_API_URL,
  // CHANGE_PASSWORD_API_URL
} from "../config/endpoints";
export const BASE_AUTH_URL = import.meta.env.VITE_APP_BASE_API_URL
import { callApi } from "./client";
// import { getHeader } from "../utils";
export const authenticateOfficer = async (data) => {
  var config = {
    method: "post",
    url: LOGIN_API_URL,
    data: data,
   
    baseURL: BASE_AUTH_URL,
  };
  return await callApi(config);
};

// export const checkTokenValidity = async () => {
//   var config = {
//     method: "GET",
//     baseURL: BASE_AUTH_URL,
//     url: USER_VALIDITY_CHECK_API_URL,
//     headers: getHeader()
//   };
//   return await callApi(config);
// };
// export const logoutUser = async () => {
//   var config = {
//     method: "post",
//     baseURL: BASE_API_URL,
//     url: LOGOUT_API_URL,
//     headers: getHeader()
//   };
//   return await callApi(config);
// };
// export const changePassword = async (formData) => {
//   const config = {
//     method: "post",
//     baseURL: BASE_AUTH_URL,
//     url: CHANGE_PASSWORD_API_URL,
//     data: formData,
//     headers: {
//       ...getHeader(), // includes auth tokens
//       // Note: Content-Type will be set by callApi when using FormData
//     }
//   };
//   return await callApi(config);
// };