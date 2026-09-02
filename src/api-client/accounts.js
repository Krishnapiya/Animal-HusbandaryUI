import { callApi } from "./client";

export const BASE_AUTH_URL = import.meta.env.VITE_APP_BASE_API_URL;

export const authenticateOfficer = async (data) => {
  const config = {
    method: "post",
    url: "/auth/login",
    data: data,
    baseURL: BASE_AUTH_URL,
  };
  return await callApi(config);
};

export const registerPetShopOwner = async (data) => {
  const config = {
    method: "post",
    url: "/auth/register-pet-shop-owner",
    data: data,
    baseURL: BASE_AUTH_URL,
    headers: { "Content-Type": "application/json" },
  };
  return await callApi(config);
};
export const registerCitizen = async (data) => {
  const config = {
    method: "post",
    url: "/auth/register-citizen",
    data: data,
    baseURL: BASE_AUTH_URL,
    headers: { "Content-Type": "application/json" },
  };
  return await callApi(config);
};