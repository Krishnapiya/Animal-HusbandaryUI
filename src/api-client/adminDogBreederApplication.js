import { getItemList, getBlobItem } from "./apiCall";

import {
  DOG_BREEDER_APPLICATION_PREVIEW_URL,
  DOG_BREEDER_APPLICATION_DOWNLOAD_URL,
  DOG_BREEDER_DOCUMENT_VIEW_URL,
  DOG_BREEDER_DOCUMENT_DOWNLOAD_URL,
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