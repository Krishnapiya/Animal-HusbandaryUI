import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  fetchDogBreederInspectionReportBlob,
  getDogBreederInspection,
} from "../../api-client/adminDogBreederApplication";

const getPayload = (response) =>
  response?.data?.payLoad ??
  response?.data?.payload ??
  response?.data ??
  null;

const recommendationLabel = (value) => {
  if (!value) {
    return "-";
  }

  if (String(value).toUpperCase() === "APPROVED") {
    return "Approved";
  }

  if (String(value).toUpperCase() === "REJECTED") {
    return "Rejected";
  }

  return value;
};

const InspectionReportDialog = ({ applicationId, onClose }) => {
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!applicationId) {
      setInspection(null);
      return undefined;
    }

    const loadInspection = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDogBreederInspection(applicationId);

        if (cancelled) {
          return;
        }

        if (!response?.isSuccess) {
          setInspection(null);
          setError("Unable to load the inspection report.");
          return;
        }

        setInspection(getPayload(response));
      } catch (loadError) {
        console.error(loadError);

        if (!cancelled) {
          setInspection(null);
          setError("Unable to load the inspection report.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInspection();

    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const openReport = async (download) => {
    const blob = await fetchDogBreederInspectionReportBlob(applicationId);
    const url = URL.createObjectURL(blob);
    const fileName = String(inspection?.inspectionReport || "inspection-report")
      .split(/[/\\]/)
      .pop();

    if (download) {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "inspection-report";
      link.click();
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const rejected =
    String(inspection?.recommendation || "").toUpperCase() === "REJECTED";
  const hasReport = Boolean(inspection?.inspectionReport);

  return (
    <Dialog
      open={Boolean(applicationId)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Inspection Report</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : !inspection ? (
          <Typography color="text.secondary">
            No inspection report has been uploaded for this application.
          </Typography>
        ) : (
          <>
            <Typography sx={{ mb: 1 }}>
              <b>Inspection date:</b> {inspection.inspectionDate || "-"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <b>Recommendation:</b>{" "}
              {recommendationLabel(inspection.recommendation)}
            </Typography>
            <Typography sx={{ mb: 2, whiteSpace: "pre-line" }}>
              <b>
                {rejected ? "Reason for rejection:" : "Remarks:"}
              </b>{" "}
              {inspection.inspectionRemarks || "-"}
            </Typography>
            {hasReport ? (
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => openReport(false)}
                >
                  View report
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => openReport(true)}
                >
                  Download report
                </Button>
              </Box>
            ) : (
              <Typography color="text.secondary">
                The remarks are saved, but no report file was uploaded.
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

InspectionReportDialog.propTypes = {
  applicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClose: PropTypes.func.isRequired,
};

export default InspectionReportDialog;
