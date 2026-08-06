import PropTypes from "prop-types";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { toast } from "material-react-toastify";
import { resubmitDogBreederApplication } from "../../api-client/adminDogBreederApplication";

/* Helper to check if application is eligible for resubmission */
const isRejectedByCvo = (row) => {
  if (!row) return false;

  // 1. Check numeric status code or status ID
  const statusCode = Number(
    row?.statusCode ?? row?.status?.statusCode ?? row?.statusId ?? row?.status?.id
  );

  // Status codes representing returned/rejected state (e.g., 4, 5, 8, 10)
  if ([4, 5, 8, 10].includes(statusCode)) {
    return true;
  }

  // 2. Fallback check for status name string
  const statusName =
    row?.status?.name ||
    row?.status?.statusName ||
    row?.statusName ||
    (typeof row?.status === "string" ? row?.status : "");

  const normalized = String(statusName).trim().toLowerCase();

  return (
    normalized.includes("rejected") ||
    normalized.includes("returned") ||
    normalized === "rejected by cvo" ||
    normalized === "rejected_by_cvo" ||
    normalized === "rejectedbycvo"
  );
};

const List = (props) => {
  const tableColumns = props.tableColumns || [];
  const rows = props.rows || [];

  // Modal state
  const [openResubmitModal, setOpenResubmitModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal handler
  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setRemarks("");
    setFile(null);
    setOpenResubmitModal(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    if (isSubmitting) return;
    setOpenResubmitModal(false);
    setSelectedRow(null);
    setRemarks("");
    setFile(null);
  };

  // Submit resubmission handler
  const handleSubmitResubmit = async () => {
  if (!selectedRow?.id) return;

  try {
    setIsSubmitting(true);

    const payload = {
      payLoad: {
        applicationId: selectedRow.id,
        remarks: remarks,
        documents: file ? [file.name] : [],
      }
    };

    await resubmitDogBreederApplication(payload);

    toast.success("Application resubmitted successfully");

    handleCloseModal();

    if (props.handleRefreshTable) {
      props.handleRefreshTable();
    }

  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to resubmit application."
    );
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {tableColumns.map((col, index) => (
              <TableCell key={col.attr || index}>
                <TableSortLabel
                  onClick={
                    typeof props.handleSortClick === "function"
                      ? props.handleSortClick(col.attr)
                      : undefined
                  }
                  active={col.attr === props.sortAttributeDirection?.attr}
                  direction={
                    col.attr === props.sortAttributeDirection?.attr
                      ? props.sortAttributeDirection?.direction
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
          {rows.map((row, index) => {
            const rejected = isRejectedByCvo(row);

            return (
              <TableRow key={row.id || index}>
                {tableColumns.map((col, colIndex) => (
                  <TableCell key={col.attr || colIndex}>
                    {typeof col.render === "function"
                      ? col.render(row)
                      : String(row[col.attr] ?? "")}
                  </TableCell>
                ))}

                {/* View Cell */}
                <TableCell align="center">
                  <Tooltip title="View Application">
                    <IconButton
                      onClick={() =>
                        typeof props.handleEditClick === "function" &&
                        props.handleEditClick(row.id)
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                {/* Action Cell */}
                <TableCell align="center">
                  {rejected ? (
                    <Button
                      variant="contained"
                      size="small"
                      color="warning"
                      startIcon={<ReplayIcon />}
                      onClick={() => handleOpenModal(row)}
                    >
                      Resubmit
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}

          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={tableColumns.length + 2}
                align="center"
                sx={{ py: 3 }}
              >
                No applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* RESUBMIT APPLICATION MODAL */}
      <Dialog
        open={openResubmitModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle align="center" sx={{ fontWeight: 600 }}>
          Resubmit Application
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Application Number
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {selectedRow?.applicationNumber || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Breeder / Shop Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {selectedRow?.breederName ||
                  selectedRow?.dogBreederDetail?.breederName ||
                  "-"}
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Remarks"
              placeholder="Enter remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                Supporting Documents
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload Documents
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>

              {file && (
                <Typography
                  variant="caption"
                  display="block"
                  color="primary"
                  sx={{ mt: 1 }}
                >
                  Selected: {file.name}
                </Typography>
              )}

              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                (Supported Formats: PDF, JPG, JPEG, PNG)
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitResubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

List.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  handleEditClick: PropTypes.func,
  handleRefreshTable: PropTypes.func,
  handleSortClick: PropTypes.func,
  rows: PropTypes.array,
  handleForwardClick: PropTypes.func,
  sortAttributeDirection: PropTypes.object,
  tableColumns: PropTypes.array,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default List;