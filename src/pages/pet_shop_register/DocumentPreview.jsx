/* eslint-disable react/prop-types */

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { BASE_API_URL } from "../../api-client/apiCall";
import { fetchApplicationDocumentBlob } from "../../api-client/petShopRegistration";
import { BRAND_COLORS } from "../../config/branding";

const buildDocumentViewUrl = (filePath) => {
  if (!filePath) {
    return null;
  }

  const encodedPath = filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${BASE_API_URL}petshop/auth/application-document/view/${encodedPath}`;
};

const getMimeType = (document) =>
  document?.mimeType ||
  document?.file?.type ||
  "";

const getFileName = (document) =>
  document?.fileName ||
  document?.name ||
  document?.file?.name ||
  "Document";

const isImageMime = (mimeType, fileName) => {
  if (mimeType.startsWith("image/")) {
    return true;
  }

  return /\.(png|jpe?g|gif|webp|bmp)$/i.test(fileName || "");
};

const isPdfMime = (mimeType, fileName) => {
  if (mimeType === "application/pdf") {
    return true;
  }

  return /\.pdf$/i.test(fileName || "");
};

const DocumentPreview = ({
  document,
  label,
  compact = false,
  showOpenButton = true,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const mimeType = getMimeType(document);
  const fileName = getFileName(document);
  const isImage = isImageMime(mimeType, fileName);
  const isPdf = isPdfMime(mimeType, fileName);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };

    setImageError(false);
    setPreviewError("");
    setIsLoadingPreview(false);

    if (!document) {
      setPreviewUrl(null);
      return cleanup;
    }

    if (document.file) {
      objectUrl = URL.createObjectURL(document.file);
      setPreviewUrl(objectUrl);

      return () => {
        cancelled = true;
        cleanup();
      };
    }

    if (document.filePath) {
      const directUrl = buildDocumentViewUrl(document.filePath);

      if (isPdf) {
        setIsLoadingPreview(true);

        (async () => {
          try {
            const blob = await fetchApplicationDocumentBlob(document.filePath);

            if (cancelled) {
              return;
            }

            const pdfBlob =
              blob.type === "application/pdf"
                ? blob
                : new Blob([blob], { type: "application/pdf" });

            objectUrl = URL.createObjectURL(pdfBlob);
            setPreviewUrl(objectUrl);
          } catch (error) {
            if (!cancelled) {
              console.error("Failed to load PDF preview", error);
              setPreviewError(
                "Unable to load PDF preview. Use Open to view the document."
              );
              setPreviewUrl(directUrl);
            }
          } finally {
            if (!cancelled) {
              setIsLoadingPreview(false);
            }
          }
        })();

        return () => {
          cancelled = true;
          cleanup();
        };
      }

      setPreviewUrl(directUrl);
      return cleanup;
    }

    setPreviewUrl(null);
    return cleanup;
  }, [document, isPdf]);

  const previewHeight = compact ? 140 : 220;
  const dialogHeight = 560;

  const previewContent = useMemo(() => {
    if (!document) {
      return null;
    }

    if (isLoadingPreview) {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={28} />
        </Box>
      );
    }

    if (!previewUrl) {
      return null;
    }

    if (isImage && !imageError) {
      return (
        <Box
          component="img"
          src={previewUrl}
          alt={label || fileName}
          onError={() => setImageError(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            backgroundColor: "#f8fafc",
          }}
        />
      );
    }

    if (isPdf) {
      return (
        <Box
          component="iframe"
          src={`${previewUrl}#toolbar=0&navpanes=0`}
          title={label || fileName}
          sx={{
            width: "100%",
            height: "100%",
            border: 0,
            backgroundColor: "#f8fafc",
          }}
        />
      );
    }

    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 2,
          backgroundColor: "#f8fafc",
        }}
      >
        <DescriptionOutlinedIcon
          sx={{ fontSize: 48, color: BRAND_COLORS.primary }}
        />
        <Typography variant="body2" align="center" sx={{ fontWeight: 600 }}>
          {fileName}
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center">
          Preview is not available for this file type. Open the document to view
          it.
        </Typography>
      </Box>
    );
  }, [
    document,
    previewUrl,
    isImage,
    isPdf,
    imageError,
    isLoadingPreview,
    label,
    fileName,
  ]);

  if (!document) {
    return (
      <Paper
        variant="outlined"
        sx={{
          mt: 1.5,
          p: 2,
          minHeight: previewHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
          borderStyle: "dashed",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No document uploaded yet
        </Typography>
      </Paper>
    );
  }

  const openInNewTab = async () => {
    if (document.file) {
      const url = URL.createObjectURL(document.file);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    if (isPdf && document.filePath) {
      try {
        const blob = await fetchApplicationDocumentBlob(document.filePath);
        const pdfBlob =
          blob.type === "application/pdf"
            ? blob
            : new Blob([blob], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      } catch (error) {
        console.error("Failed to open PDF", error);
      }
    }

    if (previewUrl) {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          mt: 1.5,
          overflow: "hidden",
          borderColor: BRAND_COLORS.border,
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: BRAND_COLORS.background,
            borderBottom: `1px solid ${BRAND_COLORS.border}`,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Preview: {fileName}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="text"
              onClick={() => setIsDialogOpen(true)}
              disabled={isLoadingPreview || !previewUrl}
              sx={{ textTransform: "none" }}
            >
              Enlarge
            </Button>

            {showOpenButton && (
              <Button
                size="small"
                variant="text"
                startIcon={<OpenInNewIcon fontSize="small" />}
                onClick={openInNewTab}
                disabled={isLoadingPreview}
                sx={{ textTransform: "none" }}
              >
                Open
              </Button>
            )}
          </Box>
        </Box>

        {previewError && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: "block", px: 2, pt: 1 }}
          >
            {previewError}
          </Typography>
        )}

        <Box
          sx={{
            height: previewHeight,
            cursor: previewUrl ? "pointer" : "default",
          }}
          onClick={() => {
            if (previewUrl && !isLoadingPreview) {
              setIsDialogOpen(true);
            }
          }}
        >
          {previewContent}
        </Box>
      </Paper>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Typography variant="h6" component="span">
            {label || fileName}
          </Typography>

          <IconButton onClick={() => setIsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ height: dialogHeight }}>{previewContent}</Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentPreview;
