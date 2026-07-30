import { getItemList, getBlobItem, addItem } from "./apiCall";
import { addFormDataItem } from "./apiCall";
import {
  DOG_BREEDER_APPLICATION_PREVIEW_URL,
  DOG_BREEDER_APPLICATION_DOWNLOAD_URL,
  DOG_BREEDER_DOCUMENT_VIEW_URL,
  DOG_BREEDER_DOCUMENT_DOWNLOAD_URL,
  DOG_BREEDER_APPLICATION_FORWARD_URL,
  DOG_BREEDER_INSPECTION_SAVE_URL,
  DOG_BREEDER_INSPECTION_REPORT_UPLOAD_URL,
  DOG_BREEDER_INSPECTION_VIEW_URL
} from "../config/endpoints";

export const getAdminDogBreederApplicationPreview = async (applicationId) => {
  return getItemList(`${DOG_BREEDER_APPLICATION_PREVIEW_URL}${applicationId}`);
};

export const downloadDogBreederApplication = async (applicationId) => {
  return getBlobItem(`${DOG_BREEDER_APPLICATION_DOWNLOAD_URL}${applicationId}`);
};

export const viewDogBreederDocument = async (documentId) => {
  return getBlobItem(`${DOG_BREEDER_DOCUMENT_VIEW_URL}${documentId}`);
};

export const downloadDogBreederDocument = async (documentId) => {
  return getBlobItem(`${DOG_BREEDER_DOCUMENT_DOWNLOAD_URL}${documentId}`);
};

export const forwardDogBreederApplication = async (applicationId) => {
  return addItem(
    `${DOG_BREEDER_APPLICATION_FORWARD_URL}${applicationId}/forward`,
    {}
  );
};
export const saveDogBreederInspection = async (payload) => {
  return addItem(DOG_BREEDER_INSPECTION_SAVE_URL, {
    payLoad: payload,
  });
};
export const uploadDogBreederInspectionReport = async (formData) => {
  return addFormDataItem(
    DOG_BREEDER_INSPECTION_REPORT_UPLOAD_URL,
    formData
  );
};
export const getDogBreederInspection = async (applicationId) => {
  return getItemList(
    `${DOG_BREEDER_INSPECTION_VIEW_URL}${applicationId}`
  );
};