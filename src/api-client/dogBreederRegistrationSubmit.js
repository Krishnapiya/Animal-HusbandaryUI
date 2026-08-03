import axiosInstance from "./axiosInstance";
import {
  DOG_BREEDER_APPLICATION_SUBMIT_URL,
} from "../constants/apiUrls";

export const submitDogBreederApplication = (applicationId) => {
  return axiosInstance.post(
    `${DOG_BREEDER_APPLICATION_SUBMIT_URL}${applicationId}`
  );
};