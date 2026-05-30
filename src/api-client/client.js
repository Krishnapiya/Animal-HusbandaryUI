import axios from "axios";

export const callApi = async (config) => {
  let response;
  try {
    response = await axios(config);
  } catch (error) {
    const status = error.response?.status;
    return {
      isSuccess: false,
      data: error.response?.data ?? { detail: error.message ?? "Request failed" },
      status,
    };
  }

  return { isSuccess: true, data: response.data, status: response.status };
};
