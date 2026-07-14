/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { toast } from "material-react-toastify";
import {
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Chip,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import DocumentPreview from "./DocumentPreview";
import {
  getApplicationDocuments,
  uploadApplicationDocument,
} from "../../api-client/petShopRegistration";
import { getUserAttributes } from "../../utils";

const documentList = [
  {
    id: 1,
    name: "Identity Proof",
    mandatory: true,
  },
  {
    id: 2,
    name: "Address Proof",
    mandatory: true,
  },
  {
    id: 3,
    name: "Shop Photograph",
    mandatory: true,
  },
  {
    id: 4,
    name: "Infrastructure Photograph",
    mandatory: true,
  },
  {
    id: 5,
    name: "Affidavit",
    mandatory: true,
  },
  {
  id: 9,
  name: "Applicant Signature",
  mandatory: true,
},
];

const getPayload = (response) =>
  response?.data?.payLoad ??
  response?.data?.payload ??
  response?.data;

const getDocumentRows = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const getDocumentTypeId = (document) =>
  document?.documentTypeId ??
  document?.documentType?.id ??
  document?.documentTypeMaster?.id;

const getApplicationId = (document) =>
  document?.applicationId ??
  document?.application?.id ??
  document?.registrationApplication?.id;

const isSavedDocument = (document) =>
  Boolean(document?.id) && !document?.file;

const Step5Documents = ({
  formValues,
  documents: documentsProp,
  setDocuments: setDocumentsProp,
  setActiveStep,
}) => {
  const [localDocuments, setLocalDocuments] = useState({});
  const documents = documentsProp ?? localDocuments;
  const setDocuments = setDocumentsProp ?? setLocalDocuments;

  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const applicationId = formValues?.applicationId;

    if (!applicationId) {
      setDocuments({});
      return undefined;
    }

    (async () => {
      try {
        setIsLoadingDocuments(true);

        const response = await getApplicationDocuments(applicationId);

        if (cancelled) {
          return;
        }

        if (response?.isSuccess) {
          const rows = getDocumentRows(getPayload(response)).filter(
            (item) => {
              const rowApplicationId = getApplicationId(item);

              return (
                rowApplicationId == null ||
                Number(rowApplicationId) === Number(applicationId)
              );
            }
          );

          const draftDocuments = rows.reduce((acc, item) => {
            const documentTypeId = getDocumentTypeId(item);

            if (!documentTypeId) {
              return acc;
            }

            const existing = acc[documentTypeId];
            const existingId = Number(existing?.id ?? 0);
            const currentId = Number(item?.id ?? 0);

            if (!existing || currentId >= existingId) {
              acc[documentTypeId] = {
                ...item,
                name: item.fileName || item.name || "",
                isDraft: true,
              };
            }

            return acc;
          }, {});

          if (Object.keys(draftDocuments).length > 0) {
            setDocuments((prev) => ({
              ...draftDocuments,
              ...prev,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load documents", error);
      } finally {
        if (!cancelled) {
          setIsLoadingDocuments(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [formValues?.applicationId, setDocuments]);

 const handleFileChange = (
  documentId,
  event
) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (
    documentId === 9 &&
    !file.type.startsWith("image/")
  ) {
    toast.error(
      "Please upload a JPG or PNG signature."
    );

    event.target.value = "";

    return;
  }

  const maxSize = 6 * 1024 * 1024;

  if (file.size > maxSize) {
    alert("File size cannot exceed 6 MB");
    event.target.value = "";
    return;
  }

  setDocuments((prev) => ({
    ...prev,
    [documentId]: {
      ...(prev[documentId] || {}),
      file,
      name: file.name,
      fileName: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
      isDraft: false,
    },
  }));
};

  const handleSaveDocuments = async () => {
    try {
      const applicationId = formValues?.applicationId;
      const selectedDocuments = Object.entries(documents).filter(
        ([, document]) => document?.file
      );

      if (!applicationId) {
        toast.error(
          "Please save shop details before uploading documents"
        );
        return false;
      }

      if (selectedDocuments.length === 0) {
        toast.info(
          "No new documents selected. Saved draft documents are already available."
        );
        return true;
      }

      for (const [documentId, document] of selectedDocuments) {
        const file = document.file;

        const response = await uploadApplicationDocument({
          file,
          applicationId,
          documentTypeId: Number(documentId),
          uploadedBy: getUserAttributes()?.id ?? 1,
        });

        if (!response?.isSuccess) {
          toast.error(
            `Failed to save ${document.fileName || file.name}`
          );
          return false;
        }

        const savedDocument = getPayload(response);

        setDocuments((prev) => ({
          ...prev,
          [documentId]: {
            ...document,
            ...savedDocument,
            id: savedDocument.id ?? document.id,
            file: null,
            name: savedDocument?.fileName || file.name,
            fileName: savedDocument?.fileName || file.name,
            mimeType: savedDocument?.mimeType || file.type,
            isDraft: true,
          },
        }));
      }

      toast.success("Documents saved successfully");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to save documents");
      return false;
    }
  };

  const handleSaveAndContinue = async () => {
    try {
      const saved = await handleSaveDocuments();

      if (!saved) {
        return;
      }

      setActiveStep(5);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Typography
  variant="h5"
  sx={{
    fontWeight: 600,
    mb: 1,
  }}
>
  Documents Upload
</Typography>

<Typography
  variant="body2"
  color="text.secondary"
  sx={{ mb: 3 }}
>
  Supported file types: <strong>PDF, JPG, JPEG, PNG</strong> &nbsp;|&nbsp;
  Maximum file size: <strong>6 MB</strong> per file
</Typography>

      {isLoadingDocuments && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Loading saved draft documents...
        </Typography>
      )}

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Grid container spacing={3}>
          {documentList.map((document) => (
            <Grid item xs={12} key={document.id}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", md: "center" },
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  <Box sx={{ width: { xs: "100%", md: "250px" } }}>
                    <Typography fontWeight={500}>{document.name}</Typography>

                    <Box sx={{ mt: 0.5, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {document.mandatory && (
                        <Chip size="small" color="error" label="Mandatory" />
                      )}

                      {isSavedDocument(documents[document.id]) && (
                        <Chip size="small" color="info" label="Saved draft" />
                      )}
                    </Box>
                  </Box>

                  <TextField
                    size="small"
                    fullWidth
                    value={
                      documents[document.id]?.name ||
                      documents[document.id]?.fileName ||
                      ""
                    }
                    placeholder="No file selected"
                    InputProps={{
                      readOnly: true,
                    }}
                  />

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ flexShrink: 0 }}
                  >
                    Upload
                    <input
  hidden
  type="file"
  accept={
    document.id === 9
      ? "image/png,image/jpeg,image/jpg"
      : ".pdf,.jpg,.jpeg,.png"
  }
  onChange={(e) =>
    handleFileChange(
      document.id,
      e
    )
  }
/>
                  </Button>
                </Box>

                <DocumentPreview
                  document={documents[document.id]}
                  label={document.name}
                  compact
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSaveAndContinue}
          >
            Save & Continue
          </Button>

         
        </Box>
      </Paper>

    
    </>
  );
};

export default Step5Documents;
