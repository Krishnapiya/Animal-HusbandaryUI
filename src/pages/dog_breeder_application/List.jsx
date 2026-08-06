import PropTypes from "prop-types";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import EventIcon from "@mui/icons-material/Event";

import { toast } from "material-react-toastify";

import { getUserAttributes } from "../../utils";

import {
  getAdminDogBreederApplicationPreview,
  downloadDogBreederApplication,
  viewDogBreederDocument,
  downloadDogBreederDocument,
  forwardDogBreederApplication,
  saveDogBreederInspection,
  uploadDogBreederInspectionReport,
  getDogBreederInspection,
  approveDogBreederApplication,
  rejectDogBreederApplication,
} from "../../api-client/adminDogBreederApplication";

/* Safely retrieve Application ID */
const getApplicationId = (row) =>
  row?.id ||
  row?.applicationId ||
  row?.registrationApplicationId ||
  row?.registration_application_id ||
  row?.registrationDetails?.id ||
  row?.registrationDetails?.applicationId;

/* Extract API response payload */
const getPayload = (response) =>
  response?.data?.payLoad ||
  response?.data?.payload ||
  response?.payLoad ||
  response?.payload ||
  response?.data ||
  response ||
  {};

/* Fallback value formatter */
const getValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return value;
};

const getArray = (value) => (Array.isArray(value) ? value : []);

/* Standardize status codes */
const normalizeStatus = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

/* Check for draft applications */
const isDraft = (row) => {
  const statusId =
    row?.status?.id ??
    row?.statusId ??
    row?.applicationStatusId ??
    row?.registrationStatusId;

  const statusValues = [
    row?.status,
    row?.status?.name,
    row?.status?.statusName,
    row?.status?.code,
    row?.status?.statusCode,
    row?.status?.label,
    row?.statusName,
    row?.statusCode,
    row?.applicationStatusName,
    row?.applicationStatusCode,
  ];

  if (Number(statusId) === 1) return true;

  return statusValues
    .map(normalizeStatus)
    .some((status) => status === "DRAFT" || status === "INCOMPLETE");
};

/* Check if already forwarded to CVO */
const isForwardedToCvo = (row) => {
  const statusId =
    row?.status?.id ??
    row?.statusId ??
    row?.applicationStatusId ??
    row?.registrationStatusId;

  const statusValues = [
    row?.status,
    row?.status?.name,
    row?.status?.statusName,
    row?.status?.code,
    row?.status?.statusCode,
    row?.status?.label,
    row?.statusName,
    row?.statusCode,
    row?.applicationStatusName,
    row?.applicationStatusCode,
  ];

  if (Number(statusId) === 5) return true;

  return statusValues
    .map(normalizeStatus)
    .some((status) => status === "FORWARDED_TO_CVO");
};

/* Standardize roles */
const normalizeRole = (role) =>
  String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");

/* Retrieve user roles */
const getLoggedInRoles = () => {
  const user = getUserAttributes();
  if (!user) return [];

  const roleValues = [
    user?.role,
    user?.roleName,
    user?.role?.name,
    user?.role?.roleName,
    user?.role?.authority,
    user?.authority,
  ];

  if (Array.isArray(user?.roles)) roleValues.push(...user.roles);
  if (Array.isArray(user?.authorities)) roleValues.push(...user.authorities);

  return roleValues
    .flatMap((role) =>
      typeof role === "string"
        ? [role]
        : [role?.name, role?.roleName, role?.authority, role?.code]
    )
    .filter(Boolean)
    .map(normalizeRole);
};

const PreviewRow = ({ label, value }) => (
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 600, mb: 1, whiteSpace: "pre-wrap" }}>
      {getValue(value)}
    </Typography>
  </Grid>
);

PreviewRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};

const SectionTitle = ({ children }) => (
  <>
    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
      {children}
    </Typography>
    <Divider sx={{ mb: 2 }} />
  </>
);

SectionTitle.propTypes = {
  children: PropTypes.node,
};

const List = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [forwardingId, setForwardingId] = useState(null);

  // Inspection Modal States
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedRowForInspection, setSelectedRowForInspection] = useState(null);
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionRemarks, setInspectionRemarks] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  // Upload Report Modal States
  const [uploadReportOpen, setUploadReportOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [inspectionReport, setInspectionReport] = useState(null);
  const [existingReport, setExistingReport] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state tracking
  const [scheduledInspectionIds, setScheduledInspectionIds] = useState(new Set());
  const [locallyForwardedIds, setLocallyForwardedIds] = useState(new Set());
  const [completedInspections, setCompletedInspections] = useState({});

  const loggedInRoles = getLoggedInRoles();
  const isAdmin = loggedInRoles.includes("ADMIN");
  const isCvo = loggedInRoles.includes("CVO");

  const submittedRows = getArray(props.rows).filter((row) => !isDraft(row));

  const showForwardAction =
    typeof props.showForwardAction === "boolean"
      ? props.showForwardAction
      : isAdmin && !isCvo;

  const showScheduleInspectionAction =
    typeof props.showScheduleInspectionAction === "boolean"
      ? props.showScheduleInspectionAction
      : isCvo;

  const showActionColumn = showForwardAction || showScheduleInspectionAction;
  const showDecisionColumn = isCvo;

  const handlePreviewClick = async (row) => {
    const applicationId = getApplicationId(row);
    if (!applicationId) {
      toast.error("Application ID missing");
      return;
    }

    setPreviewOpen(true);
    setPreviewData(row);

    try {
      setPreviewLoading(true);
      const response = await getAdminDogBreederApplicationPreview(applicationId);
      const payload = getPayload(response);
      setPreviewData({ ...row, ...payload });
    } catch (error) {
      console.error("Dog breeder preview error:", error);
      toast.error("Preview API failed. Showing available list data.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewData(null);
  };

  const handleDownloadClick = async (row) => {
    const applicationId = getApplicationId(row);
    if (!applicationId) {
      toast.error("Application ID missing");
      return;
    }

    try {
      const response = await downloadDogBreederApplication(applicationId);
      const blob = new Blob([response.data], {
        type: response.headers?.["content-type"] || "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        row.applicationNumber || `dog-breeder-application-${applicationId}`
      }.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error("Dog breeder application download error:", error);
      toast.error("Failed to download application");
    }
  };

  const openBlob = (
    response,
    fileName,
    isDownload = false,
    mimeType = "application/octet-stream"
  ) => {
    const blob = new Blob([response.data], {
      type: response.headers?.["content-type"] || mimeType || "application/octet-stream",
    });

    const url = URL.createObjectURL(blob);

    if (isDownload) {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, "_blank");
    }

    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const handleViewDocument = async (document) => {
    if (!document?.id) {
      toast.error("Document ID missing");
      return;
    }

    try {
      const response = await viewDogBreederDocument(document.id);
      openBlob(response, document.fileName, false, document.mimeType || "application/pdf");
    } catch (error) {
      console.error("Document view error:", error);
      toast.error("Failed to view document");
    }
  };

  const handleDownloadDocument = async (document) => {
    if (!document?.id) {
      toast.error("Document ID missing");
      return;
    }

    try {
      const response = await downloadDogBreederDocument(document.id);
      openBlob(response, document.fileName, true, document.mimeType || "application/octet-stream");
    } catch (error) {
      console.error("Document download error:", error);
      toast.error("Failed to download document");
    }
  };

  const handleForwardClick = async (row) => {
    const applicationId = getApplicationId(row);
    if (!applicationId) {
      toast.error("Application ID missing");
      return;
    }

    if (isForwardedToCvo(row) || locallyForwardedIds.has(applicationId)) {
      toast.info("Application is already forwarded to CVO");
      return;
    }

    if (!window.confirm("Are you sure you want to forward this application to CVO?")) {
      return;
    }

    try {
      setForwardingId(applicationId);
      await forwardDogBreederApplication(applicationId);

      setLocallyForwardedIds((previousIds) => new Set(previousIds).add(applicationId));
      toast.success("Application forwarded to CVO successfully");

      if (typeof props.refreshList === "function") {
        await props.refreshList();
      } else if (typeof props.handleRefresh === "function") {
        await props.handleRefresh();
      }
    } catch (error) {
      console.error("Dog breeder forward to CVO error:", error);
      toast.error("Failed to forward application to CVO");
    } finally {
      setForwardingId(null);
    }
  };

  const handleOpenScheduleModal = (row) => {
    setSelectedRowForInspection(row);
    setInspectionDate("");
    setInspectionRemarks("");
    setScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    if (isScheduling) return;
    setScheduleModalOpen(false);
    setSelectedRowForInspection(null);
  };

  const handleSaveInspection = async () => {
    if (!inspectionDate) {
      toast.error("Please select inspection date");
      return;
    }

    const applicationId = getApplicationId(selectedRowForInspection);

    try {
      setIsScheduling(true);

      await saveDogBreederInspection({
        applicationId,
        inspectionDate,
        inspectionRemarks,
      });

      toast.success("Inspection Scheduled Successfully");

      setCompletedInspections((prev) => ({
        ...prev,
        [applicationId]: "INSPECTION_SCHEDULED",
      }));

      setScheduledInspectionIds((prev) => new Set(prev).add(applicationId));

      handleCloseScheduleModal();

      if (typeof props.refreshList === "function") {
        await props.refreshList();
      } else if (typeof props.handleRefresh === "function") {
        await props.handleRefresh();
      }
    } catch (e) {
      console.error(e);
      toast.error("Unable to schedule inspection");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleUploadReportClick = async (row) => {
    const applicationId = getApplicationId(row);
    if (!applicationId) {
      toast.error("Application ID missing");
      return;
    }

    setSelectedApplication(row);
    setInspectionReport(null);
    setExistingReport(null);
    setRemarks("");
    setRecommendation("");

    try {
      const response = await getDogBreederInspection(applicationId);
      const data = getPayload(response);

      if (data) {
        setExistingReport(data.inspectionReport || null);
        setRemarks(data.inspectionRemarks || "");
        setRecommendation(data.recommendation || "");
      }
    } catch (error) {
      console.error(error);
    }

    setUploadReportOpen(true);
  };

  const handleCloseUploadReport = () => {
    if (isSubmitting) return;
    setUploadReportOpen(false);
    setSelectedApplication(null);
  };

  const handleSubmitDecision = async (decisionStatus, targetRow = null) => {
    const appRow = targetRow || selectedApplication;
    const applicationId = getApplicationId(appRow);

    if (!applicationId) {
      toast.error("Application ID missing");
      return;
    }

    if (!targetRow && !inspectionReport && !existingReport) {
      toast.error("Please select an inspection report file");
      return;
    }

    try {
      setIsSubmitting(true);

      if (targetRow) {
        if (decisionStatus === "APPROVED") {
          await approveDogBreederApplication(applicationId);
        } else if (decisionStatus === "REJECTED") {
          await rejectDogBreederApplication(applicationId);
        }
      } else {
        const formData = new FormData();
        formData.append("applicationId", applicationId);

        if (inspectionReport) {
          formData.append("reportFile", inspectionReport);
        }

        const combinedRemarks = recommendation.trim()
          ? `${remarks ? remarks + " | " : ""}Recommendation: ${recommendation.trim()}`
          : remarks;

        formData.append("remarks", combinedRemarks);

        const strictRecommendation = decisionStatus === "APPROVED" ? "APPROVED" : "REJECTED";
        formData.append("recommendation", strictRecommendation);

        if (typeof uploadDogBreederInspectionReport === "function") {
          await uploadDogBreederInspectionReport(formData);
        }
      }

      const status =
        decisionStatus === "APPROVED"
          ? isAdmin
            ? "APPLICATION_APPROVED"
            : "VERIFIED_BY_CVO"
          : isAdmin
          ? "APPLICATION_REJECTED"
          : "REJECTED_BY_CVO";

      setCompletedInspections((prev) => ({
        ...prev,
        [applicationId]: status,
      }));

      toast.success(
        targetRow
          ? `Application ${decisionStatus.toLowerCase()} successfully`
          : `Inspection report uploaded & ${decisionStatus.toLowerCase()} successfully`
      );

      if (!targetRow) {
        handleCloseUploadReport();
      }

      if (typeof props.refreshList === "function") {
        await props.refreshList();
      } else if (typeof props.handleRefresh === "function") {
        await props.handleRefresh();
      }
    } catch (error) {
      console.error("Error submitting decision report:", error);
      toast.error("Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const registration = previewData?.registrationDetails || previewData || {};
  const breeder = previewData?.breederDetails || {};
  const facility = previewData?.facilityDetails || {};
  const breeds = getArray(previewData?.breedDetails);
  const documents = getArray(
    previewData?.documentDetails ||
      previewData?.documents ||
      previewData?.applicationDocuments ||
      previewData?.applicationDocumentList ||
      previewData?.registrationDetails?.documentDetails ||
      previewData?.registrationDetails?.documents
  );

  return (
    <>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {props.tableColumns.map((column, index) => (
              <TableCell key={column.attr || index}>
                <TableSortLabel
                  onClick={props.handleSortClick(column.attr)}
                  active={column.attr === props.sortAttributeDirection.attr}
                  direction={
                    column.attr === props.sortAttributeDirection.attr
                      ? props.sortAttributeDirection.direction
                      : "asc"
                  }
                >
                  {column.header}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell>Preview</TableCell>
            <TableCell>Download</TableCell>

            {showActionColumn && <TableCell>Action</TableCell>}
            {showDecisionColumn && <TableCell>Decision</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {submittedRows.map((row, index) => {
            const applicationId = getApplicationId(row);
            const forwarded =
              isForwardedToCvo(row) || locallyForwardedIds.has(applicationId);

            const baseStatus = normalizeStatus(
              row?.status?.statusCode ||
                row?.status?.code ||
                row?.status?.name ||
                row?.statusName
            );

            const currentStatus =
              completedInspections[applicationId] || baseStatus;

            const isInspectionScheduled =
              currentStatus === "INSPECTION_SCHEDULED" ||
              scheduledInspectionIds.has(applicationId);

            const inspectionCompleted =
              currentStatus === "VERIFIED_BY_CVO" ||
              currentStatus === "REJECTED_BY_CVO";

            const currentlyForwarding = forwardingId === applicationId;

            return (
              <TableRow key={applicationId || index}>
                {props.tableColumns.map((column, columnIndex) => (
                  <TableCell key={column.attr || columnIndex}>
                    {column.attr === "status" ? (
                      currentStatus === "APPLICATION_APPROVED" ? (
                        "Application Approved"
                      ) : currentStatus === "APPLICATION_REJECTED" ? (
                        "Application Rejected"
                      ) : currentStatus === "VERIFIED_BY_CVO" ? (
                        "Verified by CVO"
                      ) : currentStatus === "REJECTED_BY_CVO" ? (
                        "Rejected by CVO"
                      ) : isInspectionScheduled ? (
                        "Inspection Scheduled"
                      ) : typeof column.render === "function" ? (
                        column.render(row)
                      ) : (
                        String(row[column.attr] ?? "")
                      )
                    ) : typeof column.render === "function" ? (
                      column.render(row)
                    ) : (
                      String(row[column.attr] ?? "")
                    )}
                  </TableCell>
                ))}

                <TableCell>
                  {row.entityType === "DOG_BREEDER" ? (
                    <Tooltip title="Preview Dog Breeder Application">
                      <IconButton
                        color="primary"
                        onClick={() => handlePreviewClick(row)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>
                  {row.entityType === "DOG_BREEDER" ? (
                    <Tooltip title="Download Dog Breeder Application">
                      <IconButton
                        color="success"
                        onClick={() => handleDownloadClick(row)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* ACTION COLUMN */}
                {showActionColumn && (
                  <TableCell>
                    {/* ADMIN ROLE ACTIONS */}
                    {isAdmin && (
                      <>
                        {currentStatus === "VERIFIED_BY_CVO" ? (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              disabled={isSubmitting}
                              onClick={() => handleSubmitDecision("APPROVED", row)}
                            >
                              APPROVE
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              disabled={isSubmitting}
                              onClick={() => handleSubmitDecision("REJECTED", row)}
                            >
                              REJECT
                            </Button>
                          </Box>
                        ) : currentStatus === "REJECTED_BY_CVO" ? (
                          <Button
                            variant="contained"
                            size="small"
                            disabled
                            sx={{
                              "&.Mui-disabled": {
                                backgroundColor: "#ffebee",
                                color: "#d32f2f",
                                fontWeight: "bold",
                              },
                            }}
                          >
                            REJECTED BY CVO
                          </Button>
                        ) : currentStatus === "APPROVED" ||
                          currentStatus === "APPLICATION_APPROVED" ? (
                          <Button
                            variant="contained"
                            size="small"
                            disabled
                            sx={{
                              "&.Mui-disabled": {
                                backgroundColor: "#e8f5e9",
                                color: "#2e7d32",
                                fontWeight: "bold",
                              },
                            }}
                          >
                            APPROVED
                          </Button>
                        ) : currentStatus === "APPLICATION_REJECTED" ? (
                          <Button
                            variant="contained"
                            size="small"
                            disabled
                            sx={{
                              "&.Mui-disabled": {
                                backgroundColor: "#ffebee",
                                color: "#d32f2f",
                                fontWeight: "bold",
                              },
                            }}
                          >
                            REJECTED
                          </Button>
                        ) : forwarded || isInspectionScheduled ? (
                          <Button
                            variant="contained"
                            size="small"
                            disabled
                            sx={{
                              "&.Mui-disabled": {
                                backgroundColor: "#e0e0e0",
                                color: "#757575",
                              },
                            }}
                          >
                            {isInspectionScheduled ? "INSPECTION SCHEDULED" : "FORWARDED TO CVO"}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            disabled={currentlyForwarding || inspectionCompleted}
                            onClick={() => handleForwardClick(row)}
                          >
                            {currentlyForwarding ? "FORWARDING..." : "FORWARD"}
                          </Button>
                        )}
                      </>
                    )}

                    {/* CVO ROLE ACTIONS */}
                    {isCvo && (
                      <>
                        {isInspectionScheduled ? (
                          <Button
                            variant="contained"
                            size="small"
                            disabled
                            sx={{
                              "&.Mui-disabled": {
                                backgroundColor: "#e0e0e0",
                                color: "#757575",
                              },
                            }}
                          >
                            INSPECTION SCHEDULED
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            color="info"
                            disabled={inspectionCompleted}
                            startIcon={<EventIcon />}
                            onClick={() => handleOpenScheduleModal(row)}
                          >
                            Schedule Inspection
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                )}

                {/* DECISION COLUMN */}
                {showDecisionColumn && (
                  <TableCell>
                    {inspectionCompleted ? (
                      <Button
                        variant="contained"
                        size="small"
                        color={
                          currentStatus === "VERIFIED_BY_CVO"
                            ? "success"
                            : "error"
                        }
                        disabled={true}
                        sx={{
                          "&.Mui-disabled": {
                            color: "#ffffff",
                            backgroundColor:
                              currentStatus === "VERIFIED_BY_CVO"
                                ? "success.main"
                                : "error.main",
                            opacity: 0.8,
                          },
                        }}
                      >
                        {currentStatus === "VERIFIED_BY_CVO"
                          ? "VERIFIED BY CVO"
                          : "REJECTED BY CVO"}
                      </Button>
                    ) : isCvo ? (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleUploadReportClick(row)}
                      >
                        Upload Reports
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}

          {submittedRows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={
                  (props.tableColumns?.length || 0) +
                  (showActionColumn ? 3 : 2)
                }
              >
                No dog breeder registration applications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* SCHEDULE INSPECTION DIALOG */}
      <Dialog open={scheduleModalOpen} onClose={handleCloseScheduleModal} maxWidth="xs" fullWidth>
        <DialogTitle>Schedule Inspection</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Inspection Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
            />
            <TextField
              label="Remarks"
              multiline
              rows={3}
              fullWidth
              value={inspectionRemarks}
              onChange={(e) => setInspectionRemarks(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleModal} disabled={isScheduling}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveInspection}
            disabled={isScheduling}
          >
            {isScheduling ? "Saving..." : "Save Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* UPLOAD REPORT DIALOG */}
      <Dialog open={uploadReportOpen} onClose={handleCloseUploadReport} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Inspection Report & Submit Recommendation</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Button variant="outlined" component="label">
              Select Inspection Report File
              <input
                type="file"
                hidden
                onChange={(e) => setInspectionReport(e.target.files[0])}
              />
            </Button>
            {inspectionReport && (
              <Typography variant="caption">{inspectionReport.name}</Typography>
            )}

            <TextField
              label="Inspection Remarks"
              multiline
              rows={3}
              fullWidth
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <TextField
              label="Recommendation Details"
              multiline
              rows={2}
              fullWidth
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadReport} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={isSubmitting}
            onClick={() => handleSubmitDecision("REJECTED")}
          >
            Reject (CVO)
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={isSubmitting}
            onClick={() => handleSubmitDecision("APPROVED")}
          >
            Verify & Approve (CVO)
          </Button>
        </DialogActions>
      </Dialog>

      {/* APPLICATION PREVIEW DIALOG */}
      <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle>
          Dog Breeder Application Details - {registration.applicationNumber || "-"}
        </DialogTitle>
        <DialogContent dividers>
          {previewLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <SectionTitle>Registration Details</SectionTitle>
              <Grid container spacing={2}>
                <PreviewRow label="Application Number" value={registration.applicationNumber} />
                <PreviewRow label="District" value={registration.districtName || registration.district} />
                <PreviewRow label="Local Body Type" value={registration.localBodyTypeName || registration.localBodyType} />
                <PreviewRow label="Local Body" value={registration.localBodyName || registration.localBody} />
                <PreviewRow label="Establishment Name" value={registration.establishmentName} />
                <PreviewRow label="Application Status" value={registration.statusName || registration.status} />
              </Grid>

              <SectionTitle>Breeder Details</SectionTitle>
              <Grid container spacing={2}>
                <PreviewRow label="Breeder Name" value={breeder.name || breeder.breederName} />
                <PreviewRow label="Mobile Number" value={breeder.mobileNumber || breeder.phone} />
                <PreviewRow label="Email" value={breeder.email} />
                <PreviewRow label="Address" value={breeder.address} />
              </Grid>

              <SectionTitle>Facility Details</SectionTitle>
              <Grid container spacing={2}>
                <PreviewRow label="Facility Address" value={facility.address || facility.facilityAddress} />
                <PreviewRow label="Total Area (sq ft)" value={facility.totalArea} />
                <PreviewRow label="Number of Cages / Kennels" value={facility.numberOfCages} />
                <PreviewRow label="Veterinary Care Details" value={facility.veterinaryCareDetails} />
              </Grid>

              {breeds.length > 0 && (
                <>
                  <SectionTitle>Breed Details</SectionTitle>
                  <Grid container spacing={2}>
                    {breeds.map((breed, idx) => (
                      <PreviewRow
                        key={idx}
                        label={`Breed ${idx + 1}`}
                        value={`${breed.breedName || breed.name || "-"} (Male: ${breed.maleCount || 0}, Female: ${breed.femaleCount || 0})`}
                      />
                    ))}
                  </Grid>
                </>
              )}

              {documents.length > 0 && (
                <>
                  <SectionTitle>Uploaded Documents</SectionTitle>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Document Type</TableCell>
                        <TableCell>File Name</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.map((doc, idx) => (
                        <TableRow key={doc.id || idx}>
                          <TableCell>{doc.documentTypeName || doc.documentType || "-"}</TableCell>
                          <TableCell>{doc.fileName || doc.name || "-"}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Document">
                              <IconButton size="small" color="primary" onClick={() => handleViewDocument(doc)}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Document">
                              <IconButton size="small" color="success" onClick={() => handleDownloadDocument(doc)}>
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

List.propTypes = {
  rows: PropTypes.array,
  tableColumns: PropTypes.array.isRequired,
  handleSortClick: PropTypes.func.isRequired,
  sortAttributeDirection: PropTypes.shape({
    attr: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  showForwardAction: PropTypes.bool,
  showScheduleInspectionAction: PropTypes.bool,
  refreshList: PropTypes.func,
  handleRefresh: PropTypes.func,
};

export default List;