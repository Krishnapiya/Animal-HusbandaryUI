import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import axios from "axios";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  CITIZEN_COMPLAINT_API_URL,
  CITIZEN_COMPLAINT_DOCUMENT_VIEW_URL,
} from "../../config/endpoints";
import { getHeader } from "../../utils";

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const isImageFile = (document) => {
  const mimeType = String(document?.mimeType || "").toLowerCase();
  const fileName = String(document?.fileName || document?.filePath || "");

  return (
    mimeType.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|bmp)$/i.test(fileName)
  );
};

const isPdfFile = (document) => {
  const mimeType = String(document?.mimeType || "").toLowerCase();
  const fileName = String(document?.fileName || document?.filePath || "");

  return mimeType === "application/pdf" || /\.pdf$/i.test(fileName);
};

const isVideoFile = (document) => {
  const mimeType = String(document?.mimeType || "").toLowerCase();
  const fileName = String(document?.fileName || document?.filePath || "");

  return (
    mimeType.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov|avi)$/i.test(fileName)
  );
};

const getSafeFilePathForUrl = (filePath) => {
  const sanitizedPath = String(filePath || "").replace(/^\/+/, "");

  if (!sanitizedPath) {
    return "";
  }

  return sanitizedPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
};

const buildDocumentViewUrl = (document) => {
  const filePath = document?.filePath;

  if (!filePath) {
    return "";
  }

  const safeFilePath = getSafeFilePathForUrl(filePath);
  const sanitizedBaseUrl = String(BASE_API_URL || "").replace(/\/+$/, "");

  if (!sanitizedBaseUrl || !safeFilePath) {
    return "";
  }

  return `${sanitizedBaseUrl}${CITIZEN_COMPLAINT_DOCUMENT_VIEW_URL}${safeFilePath}`;
};

const getDocumentKey = (document, fallbackIndex) => {
  if (!document) {
    return `document-${fallbackIndex}`;
  }

  return (
    document.id ??
    document.filePath ??
    document.fileName ??
    `document-${fallbackIndex}`
  );
};

const fetchDocumentBlobUrl = async (document) => {
  const documentUrl = buildDocumentViewUrl(document);

  if (!documentUrl) {
    return null;
  }

  const headers = getHeader();

  if (!headers) {
    return null;
  }

  const response = await axios.get(documentUrl, {
    headers,
    responseType: "blob",
  });

  const blob = response?.data;

  if (!(blob instanceof Blob) && !(blob instanceof ArrayBuffer)) {
    return null;
  }

  const blobObject = blob instanceof Blob ? blob : new Blob([blob]);
  return URL.createObjectURL(blobObject);
};

const buildApiUrl = (baseUrl, endpointPath, id) => {
  const normalizedBaseUrl = String(baseUrl || "").replace(/\/+$/, "");

  const normalizedEndpointPath = String(endpointPath || "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const normalizedId = String(id || "").replace(/^\/+/, "");

  if (!normalizedBaseUrl || !normalizedEndpointPath || !normalizedId) {
    return null;
  }

  return `${normalizedBaseUrl}/${normalizedEndpointPath}/view/${normalizedId}`;
};

const normalizeDeepKeys = (input) => {
  if (Array.isArray(input)) {
    return input.map(normalizeDeepKeys);
  }

  if (input && typeof input === "object") {
    return Object.entries(input).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-zA-Z])/g, (_, char) =>
        char.toUpperCase()
      );

      acc[camelKey] = normalizeDeepKeys(value);

      return acc;
    }, {});
  }

  return input;
};

const Form = ({ rowID, onClose }) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documentPreviewUrls, setDocumentPreviewUrls] = useState({});
  const [documentErrors, setDocumentErrors] = useState({});
  const [documentLoadingStates, setDocumentLoadingStates] = useState({});
  const loadingDocumentKeysRef = useRef({});

  useEffect(() => {
    return () => {
      Object.values(documentPreviewUrls).forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [documentPreviewUrls]);

  useEffect(() => {
    if (rowID === undefined || rowID === null || rowID === "") {
      return;
    }

    const fetchComplaint = async () => {
      try {
        setLoading(true);

        const url = buildApiUrl(
          BASE_API_URL,
          CITIZEN_COMPLAINT_API_URL,
          rowID
        );

        console.log("Complaint View URL:", url);
        console.log("Complaint ID:", rowID);

        if (!url) {
          throw new Error(
            "Unable to build complaint API URL. Check BASE_API_URL or endpoint constant."
          );
        }

        const headers = getHeader();

        const response = await axios.get(url, {
          headers,
        });

        console.log("Complaint View Response:", response.data);

        const responseData = response?.data ?? null;

        const payload =
          responseData?.payload ??
          responseData?.payLoad ??
          responseData?.data ??
          responseData ??
          null;

        const complaintData =
          payload?.complaint ??
          payload?.complaintRegistration ??
          payload ??
          null;

        if (!complaintData) {
          console.warn(
            "Complaint view returned no complaint data",
            response?.data
          );
        }

        setComplaint(
          complaintData
            ? normalizeDeepKeys(complaintData)
            : null
        );
      } catch (error) {
        console.error("Failed to load complaint", error);
        setComplaint(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [rowID]);

  useEffect(() => {
    if (!Array.isArray(complaint?.supportingDocuments)) {
      return undefined;
    }

    const fetchPreviewUrls = async () => {
      for (const [index, document] of complaint.supportingDocuments.entries()) {
        const key = getDocumentKey(document, index);

        if (!document || !document.filePath || documentPreviewUrls[key]) {
          continue;
        }

        if (loadingDocumentKeysRef.current[key]) {
          continue;
        }

        loadingDocumentKeysRef.current[key] = true;

        setDocumentLoadingStates((current) => ({
          ...current,
          [key]: true,
        }));
        setDocumentErrors((current) => ({
          ...current,
          [key]: false,
        }));

        try {
          const objectUrl = await fetchDocumentBlobUrl(document);

          if (!objectUrl) {
            throw new Error("Failed to create preview URL");
          }

          setDocumentPreviewUrls((current) => ({
            ...current,
            [key]: objectUrl,
          }));
        } catch (error) {
          console.error("Failed to fetch supporting document preview:", error);
          setDocumentErrors((current) => ({
            ...current,
            [key]: true,
          }));
        } finally {
          setDocumentLoadingStates((current) => ({
            ...current,
            [key]: false,
          }));
          delete loadingDocumentKeysRef.current[key];
        }
      }
    };

    fetchPreviewUrls();

    return undefined;
  }, [complaint]);

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOpenDocument = async (document) => {
    const key = getDocumentKey(document, 0);
    const existingUrl = documentPreviewUrls[key];
    const newTab = window.open("", "_blank", "noopener,noreferrer");

    if (!newTab) {
      return;
    }

    try {
      const objectUrl = existingUrl || (await fetchDocumentBlobUrl(document));

      if (!objectUrl) {
        newTab.document.write("<p>Unable to load document.</p>");
        return;
      }

      if (!existingUrl) {
        setDocumentPreviewUrls((current) => ({
          ...current,
          [key]: objectUrl,
        }));
      }

      newTab.location.href = objectUrl;
    } catch (error) {
      console.error("Failed to open supporting document:", error);
      newTab.document.write("<p>Failed to open document. Please try again.</p>");
    }
  };

  const statusName =
    complaint?.status?.name ||
    complaint?.status?.statusName ||
    complaint?.status?.statusCode ||
    "-";

  const supportingDocuments = Array.isArray(complaint?.supportingDocuments)
    ? complaint.supportingDocuments
    : [];

  return (
    <Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={5}
        >
          <CircularProgress />
        </Box>
      ) : !complaint ? (
        <Box p={4}>
          <Typography>
            No complaint found.
          </Typography>
        </Box>
      ) : (
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Complaint Details
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
            }}
            gap={3}
          >
            <Box>
              <Typography variant="subtitle2">
                Complaint Number
              </Typography>

              <Typography>
                {complaint.complaintNumber || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">
                Status
              </Typography>

              <Typography>
                {statusName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">
                Citizen User ID
              </Typography>

              <Typography>
                {complaint.citizenUserId || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">
                Pet / Animal Name
              </Typography>

              <Typography>
                {complaint.petAnimalName || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">
                Place of Incident
              </Typography>

              <Typography>
                {complaint.placeOfIncident || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">
                Incident Date
              </Typography>

              <Typography>
                {complaint.incidentDate || "-"}
              </Typography>
            </Box>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle2">
              Complaint Description
            </Typography>

            <Box
              sx={{
                mt: 1,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Typography>
                {complaint.complaintDescription || "-"}
              </Typography>
            </Box>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle2">
              Supporting Documents
            </Typography>

            {supportingDocuments.length === 0 ? (
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Typography>No documents uploaded</Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 1, display: "grid", gap: 2 }}>
                {supportingDocuments.map((document, index) => {
                  const fileName =
                    document?.fileName ||
                    document?.filePath?.split("/").pop() ||
                    `Document ${index + 1}`;
                  const documentType =
                    document?.documentTypeName ||
                    document?.documentType ||
                    "Supporting Document";
                  const documentKey = getDocumentKey(document, index);
                  const previewUrl = documentPreviewUrls[documentKey];
                  const isImage = isImageFile(document);
                  const isPdf = isPdfFile(document);
                  const isVideo = isVideoFile(document);
                  const isLoading = documentLoadingStates[documentKey];
                  const hasError = documentErrors[documentKey];

                  return (
                    <Box
                      key={documentKey}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      {isImage && previewUrl ? (
                        <Box
                          component="img"
                          src={previewUrl}
                          alt={fileName}
                          sx={{
                            width: "100%",
                            maxHeight: 220,
                            objectFit: "contain",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "#f5f5f5",
                            mb: 1.5,
                          }}
                        />
                      ) : isVideo && previewUrl ? (
                        <Box
                          component="video"
                          src={previewUrl}
                          controls
                          sx={{
                            width: "100%",
                            maxHeight: 240,
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "#000",
                            mb: 1.5,
                          }}
                        />
                      ) : isLoading ? (
                        <Box
                          sx={{
                            minHeight: 90,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            backgroundColor: "#f5f5f5",
                            mb: 1.5,
                          }}
                        >
                          <CircularProgress size={22} />
                        </Box>
                      ) : hasError ? (
                        <Box
                          sx={{
                            minHeight: 90,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            backgroundColor: "#f5f5f5",
                            mb: 1.5,
                          }}
                        >
                          <Typography variant="body2">
                            Preview unavailable
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            minHeight: 90,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            backgroundColor: "#f5f5f5",
                            mb: 1.5,
                          }}
                        >
                          <Typography variant="body2">
                            {isPdf ? "PDF document" : "Document preview available"}
                          </Typography>
                        </Box>
                      )}

                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {documentType}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, wordBreak: "break-word" }}
                      >
                        {fileName}
                      </Typography>

                      {document?.filePath ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenDocument(document)}
                          sx={{ mt: 1.5 }}
                        >
                          View
                        </Button>
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>
      )}

      <Box
        mt={3}
        px={3}
        pb={3}
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={handleBack}
          disabled={!onClose}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

Form.propTypes = {
  rowID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClose: PropTypes.func,
};

export default Form;