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

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

import { toast } from "material-react-toastify";

import {
    getAdminDogBreederApplicationPreview,
  downloadDogBreederApplication,
  viewDogBreederDocument,
  downloadDogBreederDocument,
} from "../../api-client/adminDogBreederApplication";

const getApplicationId = (row) =>
  row?.id ||
  row?.applicationId ||
  row?.registrationApplicationId ||
  row?.registration_application_id ||
  row?.registrationDetails?.id ||
  row?.registrationDetails?.applicationId;

const getPayload = (response) =>
  response?.data?.payLoad ||
  response?.data?.payload ||
  response?.payLoad ||
  response?.payload ||
  response?.data ||
  response ||
  {};

const getValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
};

const getArray = (value) => {
  return Array.isArray(value) ? value : [];
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

      console.log("DOG BREEDER PREVIEW RESPONSE:", response);
      console.log("DOG BREEDER PREVIEW PAYLOAD:", payload);

      setPreviewData({
        ...row,
        ...payload,
      });
    } catch (error) {
      console.error("Dog breeder preview error:", error);
      toast.error("Preview API failed. Showing list data.");
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
    type: mimeType || response.headers?.["content-type"] || "application/octet-stream",
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

const handleViewDocument = async (doc) => {
  if (!doc?.id) {
    toast.error("Document ID missing");
    return;
  }

  try {
    const response = await viewDogBreederDocument(doc.id);

    openBlob(
      response,
      doc.fileName,
      false,
      doc.mimeType || "application/pdf"
    );
  } catch (error) {
    console.error("Document view error:", error);
    toast.error("Failed to view document");
  }
};

const handleDownloadDocument = async (doc) => {
  if (!doc?.id) {
    toast.error("Document ID missing");
    return;
  }

  try {
    const response = await downloadDogBreederDocument(doc.id);

    openBlob(
      response,
      doc.fileName,
      true,
      doc.mimeType || "application/octet-stream"
    );
  } catch (error) {
    console.error("Document download error:", error);
    toast.error("Failed to download document");
  }
};
  const registration = previewData?.registrationDetails || previewData || {};
  const breeder = previewData?.breederDetails || {};
  const facility = previewData?.facilityDetails || {};
  const declaration = previewData?.declarationDetails || {};
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

            <TableCell>Preview</TableCell>
            <TableCell>Download</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow key={getApplicationId(row) || index}>
              {props.tableColumns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {typeof col.render === "function"
                    ? col.render(row)
                    : String(row[col.attr] ?? "")}
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
            </TableRow>
          ))}

          {props.rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={(props.tableColumns?.length || 0) + 2}>
                No dog breeder applications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Dog Breeder Application Preview</DialogTitle>

        <DialogContent dividers>
          {previewLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <SectionTitle>Registration Details</SectionTitle>

              <Grid container spacing={2}>
                <PreviewRow
                  label="Application ID"
                  value={registration.id || registration.applicationId}
                />

                <PreviewRow
                  label="Application Number"
                  value={registration.applicationNumber}
                />

                <PreviewRow
                  label="Entity Type"
                  value={registration.entityType}
                />

                <PreviewRow
                  label="Application Kind"
                  value={registration.applicationKind}
                />

                <PreviewRow
                  label="Status"
                  value={registration.status?.name || registration.statusId}
                />

                <PreviewRow
                  label="District"
                  value={registration.district?.name || registration.districtId}
                />

                <PreviewRow
                  label="Applicant User ID"
                  value={registration.applicantUserId}
                />

              </Grid>

              <SectionTitle>Breeder Details</SectionTitle>

              <Grid container spacing={2}>
                <PreviewRow label="Breeder Name" value={breeder.breederName} />

                <PreviewRow
                  label="Address Line 1"
                  value={breeder.addressLine1}
                />

                <PreviewRow
                  label="Address Line 2"
                  value={breeder.addressLine2}
                />

                <PreviewRow label="City" value={breeder.city} />

                <PreviewRow label="Pincode" value={breeder.pincode} />

                <PreviewRow label="Mobile" value={breeder.contactMobile} />

                <PreviewRow label="Email" value={breeder.contactEmail} />

                <PreviewRow
                  label="Facility Details"
                  value={breeder.facilityDetails}
                />

                <PreviewRow
                  label="Total Dogs Count"
                  value={breeder.totalDogsCount}
                />
              </Grid>

              <SectionTitle>Facility Details</SectionTitle>

              <Grid container spacing={2}>
                <PreviewRow
                  label="Accommodation Infrastructure"
                  value={facility.accommodationInfrastructure}
                />

                <PreviewRow
                  label="Working Hours"
                  value={facility.workingHours}
                />

                <PreviewRow label="Rest Day" value={facility.restDay} />

                <PreviewRow
                  label="Ventilation Arrangement"
                  value={facility.ventilationArrangement}
                />

                <PreviewRow
                  label="Lighting Arrangement"
                  value={facility.lightingArrangement}
                />

                <PreviewRow
                  label="Heating / Cooling Arrangement"
                  value={facility.heatingCoolingArrangement}
                />

                <PreviewRow
                  label="Food Storage Arrangement"
                  value={facility.foodStorageArrangement}
                />

                <PreviewRow
                  label="Cleanliness / Waste Arrangement"
                  value={facility.cleanlinessWasteArrangement}
                />

                <PreviewRow
                  label="Dead Animal Disposal"
                  value={facility.deadAnimalDisposalArrangement}
                />

                <PreviewRow
                  label="Veterinary Support"
                  value={facility.veterinarySupportArrangement}
                />

                <PreviewRow
                  label="Cage / Enclosure Details"
                  value={facility.cageEnclosureDetails}
                />
              </Grid>

              <SectionTitle>Declaration Details</SectionTitle>

              <Grid container spacing={2}>
                <PreviewRow
                  label="Qualification / Experience"
                  value={declaration.qualificationExperience}
                />

                <PreviewRow
                  label="Declaration Accepted"
                  value={declaration.declarationAccepted ? "Yes" : "No"}
                />

                <PreviewRow
                  label="Declaration Place"
                  value={declaration.declarationPlace}
                />

                <PreviewRow
                  label="Declaration Date"
                  value={declaration.declarationDate}
                />

                <PreviewRow
                  label="Applicant Name"
                  value={declaration.applicantName}
                />

                <PreviewRow
                  label="Signature Name"
                  value={declaration.signatureName}
                />

                <PreviewRow label="Signed At" value={declaration.signedAt} />
              </Grid>

              <SectionTitle>Breed Details</SectionTitle>

              {breeds.length === 0 ? (
                <Typography>No breed details found</Typography>
              ) : (
                breeds.map((breed, index) => (
                  <Box key={breed.id || index} sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <PreviewRow label="Breed Name" value={breed.breedName} />
                      <PreviewRow label="Dog Count" value={breed.dogCount} />
                      <PreviewRow
                        label="Age Description"
                        value={breed.ageDescription}
                      />
                    </Grid>

                    {index !== breeds.length - 1 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))
              )}

            <SectionTitle>Documents</SectionTitle>

{documents.length === 0 ? (
  <Typography>No documents uploaded</Typography>
) : (
  documents.map((doc, index) => (
    <Box
      key={doc.id || index}
      sx={{
        mb: 1.5,
        pb: 1.5,
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 700 }}>
          {getValue(
            doc.documentTypeName ||
              doc.documentType?.name ||
              doc.documentTypeId
          )}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          File Name: {getValue(doc.fileName)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Mime Type: {getValue(doc.mimeType)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Size: {getValue(doc.fileSizeBytes)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => handleViewDocument(doc)}
        >
          View
        </Button>

        <Button
          variant="contained"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={() => handleDownloadDocument(doc)}
        >
          Download
        </Button>
      </Box>
    </Box>
  ))
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
  tableColumns: PropTypes.array,
  handleSortClick: PropTypes.func,
  sortAttributeDirection: PropTypes.object,
};

List.defaultProps = {
  rows: [],
  tableColumns: [],
  sortAttributeDirection: {},
};

export default List;