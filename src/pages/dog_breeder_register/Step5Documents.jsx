/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid2 as Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "material-react-toastify";

import { viewApplicationDocument } from "../../api-client/applicationDocument";

export const dogBreederDocumentList = [
  { id: 22, name: "Identity Proof", mandatory: true },
  { id: 23, name: "Address Proof", mandatory: true },
  { id: 24, name: "Establishment Photograph", mandatory: true },
  { id: 25, name: "Infrastructure Photograph", mandatory: true },
  { id: 26, name: "Affidavit", mandatory: true },
  { id: 21, name: "Applicant Signature", mandatory: true },
];

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6 MB

const DocumentPreview = ({ document, documentId, onReplace }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileName = document?.fileName || document?.name || "";
  const isImage =
    document?.mimeType?.startsWith("image/") ||
    document?.type?.startsWith("image/") ||
    document?.file?.type?.startsWith("image/");

  useEffect(() => {
    let isCancelled = false;

    const loadPreview = async () => {
      // 1. Direct Blob URL for newly selected local file
      if (document?.file instanceof File) {
        const url = URL.createObjectURL(document.file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }

      const savedId =
        document?.id ||
        document?.documentId ||
        document?.applicationDocumentId;

      // 2. Fetch saved document from API if it exists on backend
      if (savedId) {
        try {
          setLoading(true);
          const response = await viewApplicationDocument(savedId);

          if (!isCancelled && response?.data) {
            const blob = new Blob([response.data], {
              type:
                response.headers?.["content-type"] ||
                document?.mimeType ||
                "application/pdf",
            });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          }
        } catch (err) {
          console.error("Failed to load document preview:", err);
        } finally {
          if (!isCancelled) setLoading(false);
        }
      } else {
        setPreviewUrl(null);
      }
    };

    const cleanup = loadPreview();

    return () => {
      isCancelled = true;
      if (cleanup && typeof cleanup === "function") {
        cleanup();
      }
    };
  }, [document]);

  const handleOpenInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  if (!fileName) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          color: "text.secondary",
          fontSize: "0.85rem",
          backgroundColor: "#fafafa",
          borderTop: "1px dashed #e0e0e0",
          mt: 2,
        }}
      >
        No document uploaded yet
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        border: "1px solid #e2e8f0",
        borderRadius: 1,
        backgroundColor: "#f8fafc",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Preview: {fileName}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => onReplace(documentId)}
            sx={{ textTransform: "none", fontSize: "0.75rem" }}
          >
            Redo
          </Button>

          <Button
            size="small"
            startIcon={<OpenInNewIcon />}
            onClick={handleOpenInNewTab}
            disabled={!previewUrl}
            sx={{ textTransform: "none", fontSize: "0.75rem" }}
          >
            Open
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: 320,
          backgroundColor: "#525659",
          borderRadius: 1,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Typography variant="body2" sx={{ color: "#fff" }}>
            Loading preview...
          </Typography>
        ) : previewUrl ? (
          isImage ? (
            <img
              src={previewUrl}
              alt="Uploaded document preview"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <iframe
              src={previewUrl}
              title="Document Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )
        ) : (
          <Typography variant="body2" sx={{ color: "#fff" }}>
            Preview unavailable
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const Step5Documents = ({
  documents,
  setDocuments,
  errors = {},
  isSaving = false,
  onBack,
  onSave,
}) => {
  const getSavedDocumentId = (file) => {
    return (
      file?.id ||
      file?.documentId ||
      file?.applicationDocumentId ||
      file?.payLoad?.id ||
      file?.payload?.id ||
      ""
    );
  };

  const getDocumentFile = (documentId) => {
    return documents?.[documentId] || null;
  };

  const handleFileChange = (event, documentId) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (documentId === 21 && !selectedFile.type.startsWith("image/")) {
      toast.error("Please upload a JPG or PNG format signature.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size cannot exceed 6 MB.");
      event.target.value = "";
      return;
    }

    setDocuments((prev) => {
      const oldDocumentId = getSavedDocumentId(prev?.[documentId]);

      return {
        ...prev,
        [documentId]: {
          id: oldDocumentId,
          documentId: oldDocumentId,
          applicationDocumentId: oldDocumentId,
          documentTypeId: documentId,
          file: selectedFile,
          fileName: selectedFile.name,
          name: selectedFile.name,
          mimeType: selectedFile.type,
          type: selectedFile.type,
          fileSizeBytes: selectedFile.size,
          size: selectedFile.size,
          filePath: "",
          saved: false,
          changed: true,
        },
      };
    });

    event.target.value = "";
  };

  const triggerFileInput = (documentId) => {
    const inputEl = document.getElementById(`file-input-${documentId}`);
    if (inputEl) {
      inputEl.click();
    }
  };

  const isSavedDocument = (documentId) => {
    const file = getDocumentFile(documentId);
    return Boolean(file?.saved === true && !file?.changed);
  };

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        Documents Upload
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Supported file formats: <strong>PDF, JPG, JPEG, PNG</strong> &nbsp;|&nbsp;
        Maximum file size: <strong>6 MB</strong> per document
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
          backgroundColor: "#fff",
          border: "1px solid #e0e0e0",
        }}
      >
        <Grid container spacing={3}>
          {dogBreederDocumentList.map((document) => {
            const docObj = getDocumentFile(document.id);
            const fileName = docObj?.fileName || docObj?.name || "";
            const isSignature = document.id === 21;
            const savedDraft = isSavedDocument(document.id);

            return (
              <Grid size={{ xs: 12 }} key={document.id}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", md: "center" },
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                    }}
                  >
                    <Box sx={{ width: { xs: "100%", md: "260px" } }}>
                      <Typography fontWeight={600} variant="body2">
                        {document.name}
                      </Typography>

                      <Box
                        sx={{
                          mt: 0.5,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {document.mandatory && (
                          <Chip
                            size="small"
                            color="error"
                            label="Mandatory"
                            sx={{ height: 20, fontSize: "0.65rem" }}
                          />
                        )}

                        {savedDraft && (
                          <Chip
                            size="small"
                            color="info"
                            label="Saved draft"
                            sx={{ height: 20, fontSize: "0.65rem" }}
                          />
                        )}
                      </Box>

                      {errors?.[document.id] && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {errors[document.id]}
                        </Typography>
                      )}
                    </Box>

                    <TextField
                      size="small"
                      fullWidth
                      value={fileName}
                      placeholder="No file selected"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        backgroundColor: "#fafafa",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                        },
                      }}
                    />

                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadFileIcon />}
                      sx={{
                        flexShrink: 0,
                        textTransform: "none",
                        borderColor: "#1976d2",
                        px: 2.5,
                      }}
                    >
                      {fileName ? "Replace" : "Upload"}
                      <input
                        id={`file-input-${document.id}`}
                        hidden
                        type="file"
                        accept={
                          isSignature
                            ? "image/png,image/jpeg,image/jpg"
                            : ".pdf,.jpg,.jpeg,.png"
                        }
                        onChange={(e) => handleFileChange(e, document.id)}
                      />
                    </Button>
                  </Box>

                  <DocumentPreview
                    document={docObj}
                    documentId={document.id}
                    onReplace={triggerFileInput}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          {onBack && (
            <Button
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBackIcon />}
              sx={{ textTransform: "none", px: 3 }}
            >
              Back
            </Button>
          )}

          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={isSaving}
            sx={{ textTransform: "none", px: 3, backgroundColor: "#2e7d32" }}
          >
            {isSaving ? "Saving..." : "Save & Continue"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

Step5Documents.propTypes = {
  documents: PropTypes.object.isRequired,
  setDocuments: PropTypes.func.isRequired,
  errors: PropTypes.object,
  isSaving: PropTypes.bool,
  onBack: PropTypes.func,
  onSave: PropTypes.func.isRequired,
};

export default Step5Documents;