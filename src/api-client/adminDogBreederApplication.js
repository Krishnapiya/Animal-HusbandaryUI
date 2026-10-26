import axios from "axios";
import { getItemList, getBlobItem, addItem, editSingleItem } from "./apiCall";
import { BASE_API_URL } from "./apiCall";
import { getHeader } from "../utils";
import { addFormDataItem } from "./apiCall";
import {
  DOG_BREEDER_APPLICATION_PREVIEW_URL,
  DOG_BREEDER_APPLICATION_DOWNLOAD_URL,
  DOG_BREEDER_MY_APPLICATION_DOWNLOAD_URL,
  DOG_BREEDER_DOCUMENT_VIEW_URL,
  DOG_BREEDER_DOCUMENT_DOWNLOAD_URL,
  DOG_BREEDER_APPLICATION_FORWARD_URL,
  DOG_BREEDER_INSPECTION_SAVE_URL,
  DOG_BREEDER_INSPECTION_REPORT_UPLOAD_URL,
  DOG_BREEDER_INSPECTION_VIEW_URL,
  DOG_BREEDER_INSPECTION_REPORT_URL,
  DOG_BREEDER_APPLICATION_APPROVE_URL, // Added
  DOG_BREEDER_APPLICATION_REJECT_URL,  // Added
  DOG_BREEDER_APPLICATION_RESUBMIT_URL,
  DOG_BREEDER_APPLICATION_STATUS_HISTORY_API_URL
} from "../config/endpoints";

export const getAdminDogBreederApplicationPreview = async (applicationId) => {
  return getItemList(`${DOG_BREEDER_APPLICATION_PREVIEW_URL}${applicationId}`);
};

export const downloadDogBreederApplication = async (applicationId) => {
  return getBlobItem(`${DOG_BREEDER_APPLICATION_DOWNLOAD_URL}${applicationId}`);
};

export const downloadDogBreederMyApplication = async (applicationId) => {
  if (!applicationId) {
    return {
      isSuccess: false,
      message: "Application ID is required",
    };
  }

  try {
    const response = await axios({
      method: "GET",
      baseURL: BASE_API_URL,
      url: `${DOG_BREEDER_MY_APPLICATION_DOWNLOAD_URL}${applicationId}`,
      headers: getHeader(),
      responseType: "blob",
    });

    const blob = response.data;
    const contentDisposition = response.headers["content-disposition"];
    let fileName = `DogBreederApplication-${applicationId}.zip`;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/i);
      if (match?.[1]) {
        fileName = match[1];
      }
    }

    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    return { isSuccess: true };
  } catch (error) {
    return {
      isSuccess: false,
      status: error.response?.status,
      message:
        error.response?.status === 404
          ? "Application not found"
          : "Failed to download application package",
    };
  }
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

export const fetchDogBreederInspectionReportBlob = async (applicationId) => {
  const response = await axios({
    method: "GET",
    baseURL: BASE_API_URL,
    url: `${DOG_BREEDER_INSPECTION_REPORT_URL}${applicationId}`,
    headers: getHeader() || {},
    responseType: "blob",
  });

  const blob = response.data;

  if (blob?.type?.includes("application/json")) {
    const errorText = await blob.text();
    throw new Error(errorText || "Failed to load inspection report");
  }

  return blob;
};
export const approveDogBreederApplication = async (applicationId) => {
  return addItem(`${DOG_BREEDER_APPLICATION_APPROVE_URL}${applicationId}`, {});
};

export const rejectDogBreederApplication = async (applicationId) => {
  return addItem(`${DOG_BREEDER_APPLICATION_REJECT_URL}${applicationId}`, {});
};

export const resubmitDogBreederApplication = async (formData) => {
  return addFormDataItem(
    DOG_BREEDER_APPLICATION_RESUBMIT_URL,
    formData
  );
};
export const getDogBreederApplicationHistory = async (applicationId) => {
  return getItemList(
    `${DOG_BREEDER_APPLICATION_STATUS_HISTORY_API_URL}${applicationId}`
  );
};

export const toggleDogBreederInspectionVisibility = async (applicationId, visible) => {
  const queryParam = visible !== undefined ? `?visible=${visible}` : "";
  return editSingleItem(
    `/dogbreeder/auth/registration-inspection/toggle-visibility/${applicationId}${queryParam}`
  );
};