import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "material-react-toastify";
import {
  getPetShopInspection,
  fetchInspectionReportBlob,
  downloadInspectionReport,
  getInspectionReportViewUrl,
  togglePetShopInspectionVisibility,
} from "../api-client/petShopRegistration";

const isImageFile = (fileName) =>
  /\.(jpe?g|png|webp|gif|bmp)$/i.test(String(fileName || ""));

const isPdfFile = (fileName) => /\.pdf$/i.test(String(fileName || ""));

const getCleanFileName = (path) => {
  if (!path) return "Inspection_Report";
  const raw = String(path).split("/").pop();
  return raw || "Inspection_Report";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
};

const PetShopInspectionReportDialog = ({
  open,
  onClose,
  applicationId,
  applicationNumber,
}) => {
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState(false);

  const handleToggleVisibility = async () => {
    if (!applicationId) return;
    try {
      setTogglingVisibility(true);
      const nextVisible = !inspection?.inspectionDateVisible;
      const res = await togglePetShopInspectionVisibility(applicationId, nextVisible);
      if (res?.isSuccess !== false) {
        toast.success(nextVisible ? "Inspection date revealed to applicant" : "Inspection date hidden from applicant");
        setInspection((prev) => ({
          ...prev,
          inspectionDateVisible: nextVisible,
        }));
      } else {
        toast.error("Failed to update visibility");
      }
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
      toast.error(err?.response?.data?.message || "Failed to update visibility");
    } finally {
      setTogglingVisibility(false);
    }
  };

  const fetchInspection = useCallback(async () => {
    if (!applicationId) return;

    setLoading(true);
    setInspection(null);
    setPreviewBlobUrl(null);

    try {
      const response = await getPetShopInspection(applicationId);
      if (response?.isSuccess) {
        const data =
          response.data?.payLoad ||
          response.data?.data ||
          response.data ||
          null;
        setInspection(data);
      } else {
        setInspection(null);
      }
    } catch (error) {
      console.error("Failed to load inspection details:", error);
      setInspection(null);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    if (open && applicationId) {
      fetchInspection();
    } else {
      setInspection(null);
      setPreviewBlobUrl(null);
    }
  }, [open, applicationId, fetchInspection]);

  const reportFilePath =
    inspection?.inspectionReport ||
    inspection?.reportFile ||
    inspection?.reportFilePath ||
    "";

  const fileName = getCleanFileName(reportFilePath);
  const isImage = isImageFile(fileName);
  const isPdf = isPdfFile(fileName);

  // Load preview blob for inline image or PDF display
  useEffect(() => {
    let active = true;
    let createdUrl = null;

    if (reportFilePath && applicationId && (isImage || isPdf)) {
      setPreviewLoading(true);
      fetchInspectionReportBlob(applicationId, reportFilePath)
        .then((blob) => {
          if (active && blob) {
            createdUrl = URL.createObjectURL(blob);
            setPreviewBlobUrl(createdUrl);
          }
        })
        .catch((err) => {
          console.warn("Could not preload report preview blob:", err);
        })
        .finally(() => {
          if (active) setPreviewLoading(false);
        });
    }

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [reportFilePath, applicationId, isImage, isPdf]);

  const handleDownload = async () => {
    if (!reportFilePath && !applicationId) return;
    setDownloading(true);
    try {
      const res = await downloadInspectionReport(
        applicationId,
        reportFilePath,
        fileName
      );
      if (res.isSuccess) {
        toast.success("Inspection report downloaded successfully");
      } else {
        const directUrl = getInspectionReportViewUrl(applicationId, reportFilePath);
        if (directUrl) {
          const link = document.createElement("a");
          link.href = directUrl;
          link.setAttribute("download", fileName);
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Inspection report download started");
        } else {
          toast.error(res.message || "Failed to download inspection report");
        }
      }
    } catch (err) {
      console.warn("Download error, trying direct URL:", err);
      const directUrl = getInspectionReportViewUrl(applicationId, reportFilePath);
      if (directUrl) {
        const link = document.createElement("a");
        link.href = directUrl;
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Inspection report download started");
      } else {
        toast.error("Error downloading report: " + (err.message || "Unknown error"));
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleViewInNewTab = async () => {
    try {
      if (previewBlobUrl) {
        window.open(previewBlobUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const blob = await fetchInspectionReportBlob(applicationId, reportFilePath);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.warn("Failed to open blob report, trying direct URL:", err);
      const directUrl = getInspectionReportViewUrl(applicationId, reportFilePath);
      if (directUrl) {
        window.open(directUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Unable to open report file");
      }
    }
  };

  const isApproved =
    String(inspection?.recommendation || "").toUpperCase() === "APPROVED";
  const isRejected =
    String(inspection?.recommendation || "").toUpperCase() === "REJECTED";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AssignmentIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" component="span" fontWeight={700}>
            Inspection Report
            {applicationNumber ? ` - ${applicationNumber}` : ""}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : !inspection ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No inspection report details found for this application.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Inspection Meta Card */}
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: "#fcfcfc",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    INSPECTION DATE
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 0.5 }}>
                    {formatDate(inspection.inspectionDate)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    APPLICANT DATE VISIBILITY
                  </Typography>
                  <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      icon={inspection.inspectionDateVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      label={inspection.inspectionDateVisible ? "Date Revealed" : "Date Hidden (Surprise Visit)"}
                      color={inspection.inspectionDateVisible ? "success" : "warning"}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      color={inspection.inspectionDateVisible ? "secondary" : "primary"}
                      disabled={togglingVisibility}
                      onClick={handleToggleVisibility}
                      sx={{ textTransform: "none", fontSize: "0.75rem" }}
                    >
                      {inspection.inspectionDateVisible ? "Hide Date" : "Reveal Date"}
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    CVO RECOMMENDATION
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {isApproved ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="VERIFIED / APPROVED BY CVO"
                        color="success"
                        variant="filled"
                        sx={{ fontWeight: 700 }}
                      />
                    ) : isRejected ? (
                      <Chip
                        icon={<CancelIcon />}
                        label="REJECTED BY CVO"
                        color="error"
                        variant="filled"
                        sx={{ fontWeight: 700 }}
                      />
                    ) : (
                      <Chip
                        label={inspection.recommendation || "Completed"}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    CVO INSPECTION REMARKS
                  </Typography>
                  <Paper
                    sx={{
                      p: 1.5,
                      mt: 0.5,
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-wrap", color: "#333" }}
                    >
                      {inspection.inspectionRemarks || "No remarks provided"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            {/* Uploaded Report Document Section */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                UPLOADED INSPECTION REPORT DOCUMENT
              </Typography>

              {reportFilePath ? (
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #dcdcdc",
                    overflow: "hidden",
                  }}
                >
                  <Grid container>
                    {/* Visual Preview / Icon */}
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        backgroundColor: "#f5f7fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 180,
                        p: 2,
                        borderRight: { sm: "1px solid #e0e0e0" },
                      }}
                    >
                      {previewLoading ? (
                        <CircularProgress size={32} />
                      ) : previewBlobUrl && isImage ? (
                        <CardMedia
                          component="img"
                          image={previewBlobUrl}
                          alt={fileName}
                          sx={{
                            maxHeight: 160,
                            maxWidth: "100%",
                            objectFit: "contain",
                            borderRadius: 1,
                          }}
                        />
                      ) : isPdf ? (
                        <Box sx={{ textAlign: "center" }}>
                          <PictureAsPdfIcon
                            sx={{ fontSize: 64, color: "#d32f2f" }}
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            PDF Document
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center" }}>
                          <DescriptionIcon
                            sx={{ fontSize: 64, color: "#1976d2" }}
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Report File
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* File Details & Actions */}
                    <Grid
                      item
                      xs={12}
                      sm={8}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 2.5,
                      }}
                    >
                      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          gutterBottom
                          sx={{ wordBreak: "break-all" }}
                        >
                          {fileName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          Official report file uploaded by Chief Veterinary Officer.
                        </Typography>
                      </CardContent>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          flexWrap: "wrap",
                          pt: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={handleViewInNewTab}
                        >
                          View Report
                        </Button>

                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          startIcon={<DownloadIcon />}
                          disabled={downloading}
                          onClick={handleDownload}
                        >
                          {downloading ? "Downloading..." : "Download Report"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: "center",
                    backgroundColor: "#fafafa",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No inspection report file was uploaded with this decision.
                  </Typography>
                </Paper>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PetShopInspectionReportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  applicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  applicationNumber: PropTypes.string,
};

export default PetShopInspectionReportDialog;
