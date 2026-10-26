import {
  CITIZEN_COMPLAINT_APPROVE_URL,
  CITIZEN_COMPLAINT_INSPECTION_REPORT_UPLOAD_URL,
  CITIZEN_COMPLAINT_REJECT_URL,
} from "../config/endpoints";
import { BASE_API_URL } from "./apiCall";
import { callApi } from "./client";
import { getHeader } from "../utils";

export const uploadComplaintInspectionReport = ({
  complaintId,
  reportFile,
  remarks,
  recommendation,
}) => {
  const formData = new FormData();

  formData.append("reportFile", reportFile);
  formData.append("remarks", remarks);
  formData.append("recommendation", recommendation);

  return callApi({
    method: "POST",
    baseURL: BASE_API_URL,
    url: `${CITIZEN_COMPLAINT_INSPECTION_REPORT_UPLOAD_URL}${complaintId}`,
    data: formData,
    headers: getHeader(),
  });
};

export const approveComplaintApplication = (id) =>
  callApi({
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: `${CITIZEN_COMPLAINT_APPROVE_URL}${id}`,
    headers: getHeader(),
  });

export const rejectComplaintApplication = (id) =>
  callApi({
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: `${CITIZEN_COMPLAINT_REJECT_URL}${id}`,
    headers: getHeader(),
  });

export const getComplaintInvestigation = (complaintId) =>
  callApi({
    method: "GET",
    baseURL: BASE_API_URL,
    url: `/citizen/auth/complaint-investigation/view-by-complaint/${complaintId}`,
    headers: getHeader(),
  });

export const toggleComplaintInvestigationVisibility = (complaintId, visible) => {
  const queryParam = visible !== undefined ? `?visible=${visible}` : "";
  return callApi({
    method: "PATCH",
    baseURL: BASE_API_URL,
    url: `/citizen/auth/complaint-investigation/toggle-visibility/${complaintId}${queryParam}`,
    headers: getHeader(),
  });
};