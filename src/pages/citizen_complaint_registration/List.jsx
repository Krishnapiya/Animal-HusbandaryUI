import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "material-react-toastify";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  addFormDataItem,
  editSingleItem,
  getBlobItem,
  getItemList,
} from "../../api-client/apiCall";
import { getUserAttributes } from "../../utils";

const VIEW_URL = "/citizen/auth/complaint-registration/view/";
const FORWARD_URL = "/citizen/auth/complaint-registration/forward/";
const SCHEDULE_URL = "/citizen/auth/complaint-registration/schedule-investigation/";
const SEND_TO_ADMIN_URL = "/citizen/auth/complaint-registration/send-to-admin/";
const APPROVE_URL = "/citizen/auth/complaint-registration/approve/";
const REPORT_UPLOAD_URL = "/citizen/auth/complaint-investigation/upload/";
const INVESTIGATION_VIEW_URL =
  "/citizen/auth/complaint-investigation/view-by-complaint/";
const DOWNLOAD_URL = "/citizen/auth/complaint-registration/download/";
const DOCUMENT_VIEW_URL = "/citizen/auth/complaint-document/view/";

const FORWARDED_STATUSES = [
  "FORWARDED_TO_CVO",
  "UNDER_REVIEW",
  "INVESTIGATION_SCHEDULED",
  "INSPECTION_SCHEDULED",
  "ACTION_TAKEN",
  "VERIFIED_BY_CVO",
  "REJECTED_BY_CVO",
  "APPLICATION_APPROVED",
  "APPLICATION_REJECTED",
];

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return value.name || value.statusName || value.label || "-";
  }

  return String(value);
};

const statusKey = (status) =>
  displayValue(status)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

const getPayload = (response) =>
  response?.data?.payLoad ??
  response?.data?.payload ??
  response?.data ??
  null;

const currentRoleNames = () => {
  const user = getUserAttributes();
  const roleValues = [
    user?.role,
    user?.roleName,
    user?.role?.roleName,
    user?.role?.name,
    user?.role?.authority,
  ];

  if (Array.isArray(user?.roles)) {
    roleValues.push(...user.roles);
  }

  if (Array.isArray(user?.authorities)) {
    roleValues.push(...user.authorities);
  }

  return roleValues
    .map((role) => {
      const name =
        typeof role === "string"
          ? role
          : role?.roleName || role?.name || role?.authority || "";

      return String(name).trim().toUpperCase().replace(/^ROLE_/, "");
    })
    .filter(Boolean);
};

const hasRole = (roleName) => currentRoleNames().includes(roleName);

const documentViewUrl = (filePath) =>
  `${DOCUMENT_VIEW_URL}${encodeURI(filePath)}`;

const fetchDocumentBlob = async (document) => {
  const response = await getBlobItem(documentViewUrl(document.filePath));

  if (!response?.isSuccess || !(response.data instanceof Blob)) {
    return null;
  }

  return response.data.type && response.data.type !== "application/octet-stream"
    ? response.data
    : new Blob([response.data], {
        type: document.mimeType || "application/octet-stream",
      });
};

const DetailRow = ({ label, value }) => (
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography sx={{ fontWeight: 600, mb: 1, whiteSpace: "pre-wrap" }}>
      {displayValue(value)}
    </Typography>
  </Grid>
);

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};

const List = (props) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({});
  const [forwardingId, setForwardingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleRow, setScheduleRow] = useState(null);
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionRemarks, setInspectionRemarks] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadRow, setUploadRow] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [reportRemarks, setReportRemarks] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const isAdmin = hasRole("ADMIN");
  const isDistrictOfficer =
    hasRole("DISTRICT_OFFICER") || hasRole("CVO");
  const showEdit = !isAdmin && !isDistrictOfficer;

  const handleViewClick = async (id) => {
    setViewOpen(true);
    setViewLoading(true);
    setViewData(null);

    const response = await getItemList(`${VIEW_URL}${id}`);

    if (!response?.isSuccess) {
      toast.error(
        response?.data?.resultString || "Could not load complaint details"
      );
      setViewLoading(false);
      return;
    }

    const complaint = getPayload(response);
    setViewData(complaint);

    const investigationResponse = await getItemList(
      `${INVESTIGATION_VIEW_URL}${id}`
    );
    setInvestigation(
      investigationResponse?.isSuccess
        ? getPayload(investigationResponse)
        : null
    );
    setViewLoading(false);
  };

  const refreshTable = () => {
    if (typeof props.handleRefreshTable === "function") {
      props.handleRefreshTable();
    }
  };

  const handleScheduleSave = async () => {
    if (!scheduleRow?.id || !inspectionDate) {
      toast.error("Inspection date is required");
      return;
    }

    setScheduling(true);
    const response = await editSingleItem(
      `${SCHEDULE_URL}${scheduleRow.id}`,
      {
        investigationDate: inspectionDate,
        investigationRemarks: inspectionRemarks,
      }
    );

    setScheduling(false);

    if (!response?.isSuccess) {
      toast.error(
        response?.data?.resultString || "Could not schedule the inspection"
      );
      return;
    }

    toast.success("Inspection scheduled");
    setScheduleOpen(false);
    refreshTable();
  };

  const handleReportUpload = async () => {
    if (!uploadRow?.id || !reportFile) {
      toast.error("Investigation report file is required");
      return;
    }

    const formData = new FormData();
    formData.append("reportFile", reportFile);
    formData.append("remarks", reportRemarks || "");

    setUploading(true);
    const response = await addFormDataItem(
      `${REPORT_UPLOAD_URL}${uploadRow.id}`,
      formData
    );
    setUploading(false);

    if (!response?.isSuccess) {
      toast.error(
        response?.data?.resultString || "Could not upload the investigation report"
      );
      return;
    }

    toast.success("Investigation report uploaded");
    setUploadOpen(false);
    refreshTable();
  };

  const handleSendToAdmin = async (id) => {
    setSendingId(id);
    const response = await editSingleItem(`${SEND_TO_ADMIN_URL}${id}`, {});
    setSendingId(null);

    if (!response?.isSuccess) {
      toast.error(
        response?.data?.resultString || "Could not send the report to admin"
      );
      return;
    }

    toast.success("Investigation report sent to admin");
    refreshTable();
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    const response = await editSingleItem(`${APPROVE_URL}${id}`, {});
    setApprovingId(null);

    if (!response?.isSuccess) {
      toast.error(
        response?.data?.resultString || "Could not approve the report"
      );
      return;
    }

    toast.success("Investigation report approved");
    refreshTable();
  };

  const handleForwardClick = async (id) => {
    setForwardingId(id);

    const response = await editSingleItem(`${FORWARD_URL}${id}`, {});

    if (!response?.isSuccess) {
      toast.error(
        response?.data?.resultString || "Could not forward the complaint"
      );
      setForwardingId(null);
      return;
    }

    toast.success("Complaint forwarded to CVO");
    setForwardingId(null);
    refreshTable();
  };

  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocument = async (documentItem) => {
    if (!documentItem?.filePath) {
      toast.error("File path missing");
      return;
    }

    setDownloadingId(documentItem.id);
    const blob = await fetchDocumentBlob(documentItem);
    setDownloadingId(null);

    if (!blob) {
      toast.error("Could not download the document");
      return;
    }

    downloadBlob(blob, documentItem.fileName);
  };

  const handleDownloadComplaint = async (row) => {
    setDownloadingId(row.id);
    const response = await getBlobItem(`${DOWNLOAD_URL}${row.id}`);
    setDownloadingId(null);

    if (!response?.isSuccess || !(response.data instanceof Blob)) {
      toast.error("Could not download the complaint package");
      return;
    }

    const complaintNumber = displayValue(row.complaintNumber);
    const fileName =
      complaintNumber !== "-"
        ? `${complaintNumber}.zip`
        : `complaint-${row.id}.zip`;

    downloadBlob(response.data, fileName);
  };

  const documents = Array.isArray(viewData?.supportingDocuments)
    ? viewData.supportingDocuments
    : [];

  useEffect(() => {
    if (!viewOpen || documents.length === 0) {
      return undefined;
    }

    let cancelled = false;
    const createdUrls = [];

    const loadPreviews = async () => {
      const nextUrls = {};

      for (const documentItem of documents) {
        if (!documentItem?.filePath) {
          continue;
        }

        const blob = await fetchDocumentBlob(documentItem);
        if (!blob || cancelled) {
          continue;
        }

        const url = URL.createObjectURL(blob);
        createdUrls.push(url);
        nextUrls[documentItem.id] = url;
      }

      if (!cancelled) {
        setPreviewUrls(nextUrls);
      }
    };

    loadPreviews();

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls({});
    };
  }, [viewOpen, viewData]);

  return (
    <>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {props.tableColumns.map((col, index) => (
              <TableCell key={index}>
                <TableSortLabel
                  onClick={props.handleSortClick(col.attr)}
                  active={col.attr === props.sortAttributeDirection.attr}
                  direction={
                    col.attr === props.sortAttributeDirection.attr
                      ? props.sortAttributeDirection.direction
                      : "asc"
                  }
                >
                  {col.header}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell align="center">View</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.length > 0 ? (
            props.rows.map((row) => {
              const currentStatus = statusKey(row.status);
              const forwarded = FORWARDED_STATUSES.includes(currentStatus);
              const canSchedule = [
                "FORWARDED_TO_CVO",
                "UNDER_REVIEW",
              ].includes(currentStatus);
              const canUpload = [
                "INVESTIGATION_SCHEDULED",
                "INSPECTION_SCHEDULED",
              ].includes(currentStatus);
              const canSend = currentStatus === "ACTION_TAKEN";
              const canApprove = currentStatus === "VERIFIED_BY_CVO";
              const canEditComplaint = showEdit && currentStatus === "DRAFT";

              return (
                <TableRow key={row.id}>
                  {props.tableColumns.map((col) => (
                    <TableCell key={col.attr}>
                      {typeof row[col.attr] === "object" &&
                      row[col.attr] !== null
                        ? row[col.attr].name
                        : row[col.attr]}
                    </TableCell>
                  ))}

                  <TableCell align="center">
                    <Tooltip title="View complaint">
                      <IconButton onClick={() => handleViewClick(row.id)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {canEditComplaint && (
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => props.handleEditClick(row.id)}
                            disabled={!props.canEdit}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        disabled={downloadingId === row.id}
                        onClick={() => handleDownloadComplaint(row)}
                      >
                        Download
                      </Button>

                      {isAdmin && !forwarded && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<SendIcon />}
                          disabled={forwardingId === row.id}
                          onClick={() => handleForwardClick(row.id)}
                        >
                          {forwardingId === row.id
                            ? "Forwarding..."
                            : "Forward to CVO"}
                        </Button>
                      )}

                      {isAdmin && forwarded && !canApprove && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<SendIcon />}
                          disabled
                        >
                          {currentStatus === "APPLICATION_APPROVED"
                            ? "Approved"
                            : "Forwarded to CVO"}
                        </Button>
                      )}

                      {isAdmin && canApprove && (
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          disabled={approvingId === row.id}
                          onClick={() => handleApprove(row.id)}
                        >
                          {approvingId === row.id
                            ? "Approving..."
                            : "Approve Report"}
                        </Button>
                      )}

                      {isDistrictOfficer && canSchedule && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<EventIcon />}
                          onClick={() => {
                            setScheduleRow(row);
                            setInspectionDate("");
                            setInspectionRemarks("");
                            setScheduleOpen(true);
                          }}
                        >
                          Schedule Inspection
                        </Button>
                      )}

                      {isDistrictOfficer && canUpload && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<UploadFileIcon />}
                          onClick={() => {
                            setUploadRow(row);
                            setReportFile(null);
                            setReportRemarks("");
                            setUploadOpen(true);
                          }}
                        >
                          Upload Investigation Report
                        </Button>
                      )}

                      {isDistrictOfficer && canSend && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<SendIcon />}
                          disabled={sendingId === row.id}
                          onClick={() => handleSendToAdmin(row.id)}
                        >
                          {sendingId === row.id
                            ? "Sending..."
                            : "Send to Admin"}
                        </Button>
                      )}

                      {isDistrictOfficer &&
                        (canApprove ||
                          currentStatus === "APPLICATION_APPROVED") && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<SendIcon />}
                            disabled
                          >
                            {currentStatus === "APPLICATION_APPROVED"
                              ? "Approved"
                              : "Sent to Admin"}
                          </Button>
                        )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={props.tableColumns.length + 2}
                align="center"
              >
                No Records Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Complaint Details - {displayValue(viewData?.complaintNumber)}
        </DialogTitle>
        <DialogContent dividers>
          {viewLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                <DetailRow
                  label="Complaint Number"
                  value={viewData?.complaintNumber}
                />
                <DetailRow label="Status" value={viewData?.status} />
                <DetailRow
                  label="Place of Incident"
                  value={viewData?.placeOfIncident}
                />
                <DetailRow
                  label="Pet / Animal Name"
                  value={viewData?.petAnimalName}
                />
                <DetailRow
                  label="Incident Date"
                  value={viewData?.incidentDate}
                />
                <DetailRow
                  label="Description"
                  value={viewData?.complaintDescription}
                />
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Supporting Documents
              </Typography>

              {documents.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  {documents.map((documentItem) => {
                    const previewUrl = previewUrls[documentItem.id];
                    const mimeType = documentItem.mimeType || "";
                    const isImage = mimeType.startsWith("image/");
                    const isPdf = mimeType === "application/pdf";
                    const isVideo = mimeType.startsWith("video/");

                    return (
                      <Box
                        key={documentItem.id}
                        sx={{ border: "1px solid #d0d0d0", p: 1 }}
                      >
                        <Box
                          sx={{
                            height: 180,
                            bgcolor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            mb: 1,
                          }}
                        >
                          {isImage && previewUrl ? (
                            <Box
                              component="img"
                              src={previewUrl}
                              alt={documentItem.fileName}
                              sx={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                              }}
                            />
                          ) : isPdf && previewUrl ? (
                            <Box
                              component="iframe"
                              src={previewUrl}
                              title={documentItem.fileName}
                              sx={{ width: "100%", height: "100%", border: 0 }}
                            />
                          ) : isVideo && previewUrl ? (
                            <Box
                              component="video"
                              src={previewUrl}
                              controls
                              sx={{ maxWidth: "100%", maxHeight: "100%" }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {previewUrl
                                ? "Preview not available"
                                : "Loading preview..."}
                            </Typography>
                          )}
                        </Box>

                        <Typography variant="subtitle2" fontWeight="bold">
                          {displayValue(documentItem.documentTypeName)}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {displayValue(documentItem.fileName)}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          disabled={downloadingId === documentItem.id}
                          onClick={() => handleDownloadDocument(documentItem)}
                        >
                          Download
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography>No supporting documents uploaded.</Typography>
              )}

              {investigation?.investigationReportPath && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Investigation Report
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Inspection date: {displayValue(investigation.investigationDate)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Remarks: {displayValue(investigation.reportRemarks)}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleDownloadDocument({
                        id: `report-${investigation.id}`,
                        filePath: investigation.investigationReportPath,
                        fileName:
                          investigation.investigationReportPath
                            .split("/")
                            .pop(),
                        mimeType: "application/octet-stream",
                      })
                    }
                  >
                    Download Report
                  </Button>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<DownloadIcon />}
            disabled={!viewData?.id || downloadingId === viewData?.id}
            onClick={() => handleDownloadComplaint(viewData)}
          >
            Download
          </Button>
          <Button
            startIcon={<CloseIcon />}
            onClick={() => setViewOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={scheduleOpen}
        onClose={() => !scheduling && setScheduleOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Schedule Inspection</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Inspection Date"
              type="date"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={inspectionDate}
              onChange={(event) => setInspectionDate(event.target.value)}
            />
            <TextField
              label="Remarks"
              multiline
              rows={3}
              fullWidth
              value={inspectionRemarks}
              onChange={(event) => setInspectionRemarks(event.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<CloseIcon />}
            disabled={scheduling}
            onClick={() => setScheduleOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<EventIcon />}
            disabled={scheduling}
            onClick={handleScheduleSave}
          >
            {scheduling ? "Saving..." : "Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={uploadOpen}
        onClose={() => !uploading && setUploadOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Investigation Report</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
              {reportFile ? reportFile.name : "Choose report file"}
              <input
                hidden
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(event) =>
                  setReportFile(event.target.files?.[0] || null)
                }
              />
            </Button>
            <TextField
              label="Remarks"
              multiline
              rows={3}
              fullWidth
              value={reportRemarks}
              onChange={(event) => setReportRemarks(event.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<CloseIcon />}
            disabled={uploading}
            onClick={() => setUploadOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            disabled={uploading}
            onClick={handleReportUpload}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

List.propTypes = {
  rows: PropTypes.array,
  tableColumns: PropTypes.array,
  handleEditClick: PropTypes.func,
  handleSortClick: PropTypes.func,
  sortAttributeDirection: PropTypes.object,
  canEdit: PropTypes.bool,
  handleRefreshTable: PropTypes.func,
};

export default List;
