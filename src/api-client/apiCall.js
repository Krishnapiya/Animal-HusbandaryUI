export const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;
import { callApi } from "./client";
import { getHeader } from "../utils";
export const getItemList = async (api_url, params) => {
  const config = {
    method: "GET",
    baseURL: BASE_API_URL,
    url: api_url,
    params: params,
    headers: getHeader(),
  };

  return await callApi(config);
};

export const addItem = async (api_url, data, includeToken = true) => {
  const config = {
    method: "POST",
    baseURL: BASE_API_URL,
    url: api_url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      ...(includeToken ? getHeader() || {} : {}),
    },
  };

  return await callApi(config);
};
export const getItem = async (api_url, id, params) => {
  const config = {
    method: "GET",
    baseURL: BASE_API_URL,
    url: api_url + id + "/",
    params: params,
    headers: getHeader(),
  };

  return await callApi(config);
};
export const getItemByID = async (api_url,params) => {
  const config = {
    method: "GET",
    baseURL: BASE_API_URL,
    url: api_url ,
    params: params,
    headers: getHeader(),
  };

  return await callApi(config);
};
export const getUserProfile = async (api_url) => {
  const config = {
    method: "GET",
    baseURL: BASE_API_URL,
    url: api_url,
    headers: getHeader(),
  };

  return await callApi(config);
};
export const editItem = async (api_url, id, data) => {
  const config = {
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: api_url + id + "/",
    data: data,
    headers: getHeader(),
  };

  return await callApi(config);
};
export const editSingleItem = async (api_url, data) => {
  const config = {
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: api_url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      ...(getHeader() || {}),
    },
  };

  return await callApi(config);
};
export const editUserProfile = async (api_url, data) => {
  const config = {
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: api_url,
    data: data,
    headers: getHeader(),
  };

  return await callApi(config);
};
export const deleteItem = async (api_url, id) => {
  const config = {
    method: "DELETE",
    baseURL: BASE_API_URL,
    url: api_url + id ,
    headers: getHeader(),
  };

  return await callApi(config);
};
export const getItemPostList = async (api_url, data) => {
  let page = 1;
  if (data.page) {
    page = data.page;
  }
  const config = {
    method: "POST",
    baseURL: BASE_API_URL,
    url: api_url,
    data: data,
    params: { page: page },
    headers: getHeader(),
  };

  return await callApi(config);
};
export const getItemPostData = async (api_url, data, params) => {
  const config = {
    method: "POST",
    baseURL: BASE_API_URL,
    url: api_url,
    data: data,
    params: params,
    headers: getHeader(),
  };

  return await callApi(config);
};
export const getItemPostDataWithoutAuthentication = async (
  api_url,
  data,
  params,
) => {
  const config = {
    method: "POST",
    baseURL: BASE_API_URL,
    url: api_url,
    data: data,
    params: params,
  };

  return await callApi(config);
};

export const publishItem = async (api_url, id) => {
  const config = {
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: api_url + id + "/",
    headers: getHeader(),
  };

  return await callApi(config);
};
export const getItemWithoutAuth = async (api_url) => {
  const config = {
    method: "GET",
    baseURL: BASE_API_URL,
    url: api_url,
  };

  return await callApi(config);
};
export const addFormDataItem = async (api_url, formData, includeToken = true) => {
  const headers = includeToken ? getHeader() || {} : {};

  // Important: remove JSON content type for file upload
  delete headers["Content-Type"];
  delete headers["content-type"];

  const config = {
    method: "POST",
    baseURL: BASE_API_URL,
    url: api_url,
    data: formData,
    headers,
  };

  return await callApi(config);
};

export const getBlobItem = async (api_url, params) => {
  const config = {
    method: "GET",
    baseURL: BASE_API_URL,
    url: api_url,
    params: params,
    responseType: "blob",
    headers: getHeader(),
  };

  return await callApi(config);
};