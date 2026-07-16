import PropTypes from "prop-types";
import {
  Box,
  Button,
  Chip,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { viewApplicationDocument } from "../../api-client/applicationDocument";

export const dogBreederDocumentList = [
  { id: 22, name: "Identity Proof", mandatory: true },
  { id: 23, name: "Address Proof", mandatory: true },
  { id: 24, name: "Establishment Photograph", mandatory: true },
  { id: 25, name: "Infrastructure Photograph", mandatory: true },
  { id: 26, name: "Affidavit", mandatory: true },
  { id: 21, name: "Applicant Signature", mandatory: true },
];

const Step5Documents = ({
  documents,
  setDocuments,
  errors,
  isSaving,
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
    const selectedFile = event.target.files && event.target.files[0];

    if (!selectedFile) {
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

  const getDocumentName = (documentId) => {
    const file = getDocumentFile(documentId);
    return file?.fileName || file?.name || "";
  };

  const getDocumentSize = (documentId) => {
    const file = getDocumentFile(documentId);
    const size = file?.fileSizeBytes || file?.size || 0;

    if (!size) {
      return "";
    }

    return `${Math.round(size / 1024)} KB`;
  };

  const isSavedDocument = (documentId) => {
    const file = getDocumentFile(documentId);
    return file?.saved === true && file?.changed !== true;
  };

  const openBlobInWindow = (blob, targetWindow) => {
    const blobUrl = URL.createObjectURL(blob);

    if (targetWindow) {
      targetWindow.location.href = blobUrl;
    } else {
      window.open(blobUrl, "_blank");
    }

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 60000);
  };

  const handleViewDocument = async (documentId) => {
    const file = getDocumentFile(documentId);

    if (!file) {
      alert("Document not found.");
      return;
    }

    const targetWindow = window.open("", "_blank");

    if (targetWindow) {
      targetWindow.document.write("Loading document...");
    }

    try {
      // View newly selected file before saving
      if (file.file instanceof File) {
        openBlobInWindow(file.file, targetWindow);
        return;
      }

      if (file instanceof File) {
        openBlobInWindow(file, targetWindow);
        return;
      }

      // View already saved file from backend
      const savedDocumentId = getSavedDocumentId(file);

      if (!savedDocumentId) {
        if (targetWindow) {
          targetWindow.close();
        }

        console.log("DOCUMENT WITHOUT ID:", file);
        alert("Document ID missing. Please reload the page and try again.");
        return;
      }

      const response = await viewApplicationDocument(savedDocumentId);

      console.log("VIEW STATUS:", response.status);
      console.log("VIEW CONTENT TYPE:", response.headers?.["content-type"]);
      console.log("VIEW BLOB SIZE:", response.data?.size);

      if (!response.data || response.data.size === 0) {
        if (targetWindow) {
          targetWindow.close();
        }

        alert("File is empty or not found.");
        return;
      }

      const contentType =
        response.headers?.["content-type"] ||
        file.mimeType ||
        file.type ||
        "application/pdf";

      const blob = new Blob([response.data], {
        type: contentType,
      });

      openBlobInWindow(blob, targetWindow);
    } catch (error) {
      console.error("DOCUMENT VIEW ERROR", error);

      if (targetWindow) {
        targetWindow.close();
      }

      alert("Could not open document. Please check backend view API.");
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Kerala State Animal Welfare Board — FORM 1 Dog Breeder Registration
      </Typography>

      <Box
        sx={{
          p: 2,
          border: "1px solid #333",
          borderRadius: 1,
          backgroundColor: "#222",
          color: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Documents Upload
        </Typography>

        {dogBreederDocumentList.map((document) => {
          const documentName = getDocumentName(document.id);
          const documentSize = getDocumentSize(document.id);
          const savedDocument = isSavedDocument(document.id);

          return (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={document.id}
              sx={{
                mb: 3,
                p: 1.5,
                border: "1px solid #444",
                borderRadius: 1,
              }}
            >
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {document.name}
                </Typography>

                {document.mandatory && (
                  <Chip
                    label="Mandatory"
                    size="small"
                    color="error"
                    sx={{ mt: 0.5 }}
                  />
                )}

                {errors?.[document.id] && (
                  <Typography color="error" variant="caption" display="block">
                    {errors[document.id]}
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                {documentName ? (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: savedDocument ? "#4ade80" : "#93c5fd",
                        fontWeight: 600,
                      }}
                    >
                      {savedDocument
                        ? `Already uploaded: ${documentName}`
                        : `Selected: ${documentName}`}
                    </Typography>

                    {documentSize && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#d1d5db",
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        Size: {documentSize}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                    No document uploaded
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {documentName && (
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDocument(document.id)}
                      sx={{
                        textTransform: "none",
                        color: "#fff",
                        borderColor: "#4ade80",
                      }}
                    >
                      View
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{
                      textTransform: "none",
                      color: "#fff",
                      borderColor: "#93c5fd",
                    }}
                  >
                    {documentName ? "Replace" : "Upload"}

                    <input
                      hidden
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(event) =>
                        handleFileChange(event, document.id)
                      }
                    />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          );
        })}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ textTransform: "none" }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={isSaving}
            sx={{ textTransform: "none", backgroundColor: "#22c55e" }}
          >
            {isSaving ? "Saving..." : "Save & Continue"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

Step5Documents.propTypes = {
  documents: PropTypes.object.isRequired,
  setDocuments: PropTypes.func.isRequired,
  errors: PropTypes.object,
  isSaving: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

Step5Documents.defaultProps = {
  errors: {},
  isSaving: false,
};

export default Step5Documents;