import { addFormDataItem, getItemList, getBlobItem } from "./apiCall";

import {
  APPLICATION_DOCUMENT_UPLOAD_URL,
  APPLICATION_DOCUMENT_BY_APPLICATION_URL,
  APPLICATION_DOCUMENT_VIEW_URL,
   APPLICATION_DOCUMENT_DOWNLOAD_URL,
} from "../config/endpoints";

export const uploadApplicationDocument = async ({
  applicationId,
  documentTypeId,
  uploadedBy,
  file,
}) => {
  if (!applicationId) {
    throw new Error("Application ID missing");
  }

  if (!documentTypeId) {
    throw new Error("Document type ID missing");
  }

  if (!uploadedBy) {
    throw new Error("Uploaded by user ID missing");
  }

  if (!(file instanceof File)) {
    throw new Error("Valid file missing");
  }

  if (file.size <= 0) {
    throw new Error("Selected file is empty");
  }

  const formData = new FormData();

  formData.append("applicationId", String(applicationId));
  formData.append("documentTypeId", String(documentTypeId));
  formData.append("uploadedBy", String(uploadedBy));

  // Important: pass file name also
  formData.append("file", file, file.name);

  console.log("UPLOAD FORM DATA CHECK");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  return addFormDataItem(APPLICATION_DOCUMENT_UPLOAD_URL, formData);
};

export const getApplicationDocumentsByApplicationId = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID missing");
  }

  return getItemList(
    `${APPLICATION_DOCUMENT_BY_APPLICATION_URL}${applicationId}`
  );
};

export const getApplicationDocumentViewUrl = (documentId) => {
  if (!documentId) {
    return "#";
  }

  return `${APPLICATION_DOCUMENT_VIEW_URL}${documentId}`;
};

export const viewApplicationDocument = async (documentId) => {
  if (!documentId) {
    throw new Error("Document ID missing");
  }

  return getBlobItem(`${APPLICATION_DOCUMENT_VIEW_URL}${documentId}`);
};
export const downloadApplicationDocument = async (documentId) => {
  if (!documentId) {
    throw new Error("Document ID missing");
  }

  return getBlobItem(`${APPLICATION_DOCUMENT_DOWNLOAD_URL}${documentId}`);
};