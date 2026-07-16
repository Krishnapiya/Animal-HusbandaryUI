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

import { getUserAttributes } from "../../utils";

import {
  getAdminDogBreederApplicationPreview,
  downloadDogBreederApplication,
  viewDogBreederDocument,
  downloadDogBreederDocument,
  forwardDogBreederApplication,
} from "../../api-client/adminDogBreederApplication";

/*
 * Get application ID safely from different response formats.
 */
const getApplicationId = (row) =>
  row?.id ||
  row?.applicationId ||
  row?.registrationApplicationId ||
  row?.registration_application_id ||
  row?.registrationDetails?.id ||
  row?.registrationDetails?.applicationId;

/*
 * Extract API response payload.
 */
const getPayload = (response) =>
  response?.data?.payLoad ||
  response?.data?.payload ||
  response?.payLoad ||
  response?.payload ||
  response?.data ||
  response ||
  {};

/*
 * Display fallback value.
 */
const getValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
};

const getArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/*
 * Convert:
 *
 * Forwarded to CVO
 * forwarded-to-cvo
 * FORWARDED_TO_CVO
 *
 * into:
 *
 * FORWARDED_TO_CVO
 */
const normalizeStatus = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

/*
 * Check whether an application is already forwarded.
 */
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

  if (Number(statusId) === 5) {
    return true;
  }

  return statusValues
    .map(normalizeStatus)
    .some((status) => status === "FORWARDED_TO_CVO");
};

/*
 * Normalize ROLE_ADMIN / ADMIN to ADMIN.
 */
const normalizeRole = (role) =>
  String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");

/*
 * Extract role values from logged-in user.
 */
const getLoggedInRoles = () => {
  const user = getUserAttributes();

  if (!user) {
    return [];
  }

  const roleValues = [
    user?.role,
    user?.roleName,
    user?.role?.name,
    user?.role?.roleName,
    user?.role?.authority,
    user?.authority,
  ];

  if (Array.isArray(user?.roles)) {
    roleValues.push(...user.roles);
  }

  if (Array.isArray(user?.authorities)) {
    roleValues.push(...user.authorities);
  }

  return roleValues
    .flatMap((role) => {
      if (typeof role === "string") {
        return [role];
      }

      return [
        role?.name,
        role?.roleName,
        role?.authority,
        role?.code,
      ];
    })
    .filter(Boolean)
    .map(normalizeRole);
};

const PreviewRow = ({ label, value }) => (
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    <Typography
      sx={{
        fontWeight: 600,
        mb: 1,
        whiteSpace: "pre-wrap",
      }}
    >
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

  /*
   * Used so the button immediately becomes disabled after forwarding,
   * even if DataTable refresh is delayed.
   */
  const [locallyForwardedIds, setLocallyForwardedIds] = useState(
    new Set()
  );

  const loggedInRoles = getLoggedInRoles();

  const isAdmin = loggedInRoles.includes("ADMIN");
  const isCvo = loggedInRoles.includes("CVO");

  /*
   * Parent can optionally pass showForwardAction.
   * Otherwise role is detected from logged-in user.
   */
  const showForwardAction =
    typeof props.showForwardAction === "boolean"
      ? props.showForwardAction
      : isAdmin && !isCvo;

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

      const response =
        await getAdminDogBreederApplicationPreview(applicationId);

      const payload = getPayload(response);

      setPreviewData({
        ...row,
        ...payload,
      });
    } catch (error) {
      console.error("Dog breeder preview error:", error);

      toast.error(
        "Preview API failed. Showing available list data."
      );
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
      const response =
        await downloadDogBreederApplication(applicationId);

      const blob = new Blob([response.data], {
        type:
          response.headers?.["content-type"] ||
          "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;

      link.download = `${
        row.applicationNumber ||
        `dog-breeder-application-${applicationId}`
      }.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error(
        "Dog breeder application download error:",
        error
      );

      toast.error("Failed to download application");
    }
  };

  const handleForwardClick = async (row) => {
    const applicationId = getApplicationId(row);

    if (!applicationId) {
      toast.error("Application ID missing");
      return;
    }

    /*
     * Prevent forwarding an already-forwarded row.
     */
    if (
      isForwardedToCvo(row) ||
      locallyForwardedIds.has(applicationId)
    ) {
      toast.info("Application is already forwarded to CVO");
      return;
    }

    const confirmForward = window.confirm(
      "Are you sure you want to forward this application to CVO?"
    );

    if (!confirmForward) {
      return;
    }

    try {
      setForwardingId(applicationId);

      await forwardDogBreederApplication(applicationId);

      /*
       * Immediately disable the button.
       */
      setLocallyForwardedIds((previousIds) => {
        const updatedIds = new Set(previousIds);
        updatedIds.add(applicationId);
        return updatedIds;
      });

      toast.success(
        "Application forwarded to CVO successfully"
      );

      if (typeof props.refreshList === "function") {
        await props.refreshList();
      } else if (typeof props.handleRefresh === "function") {
        await props.handleRefresh();
      }
    } catch (error) {
      console.error(
        "Dog breeder forward to CVO error:",
        error
      );

      toast.error("Failed to forward application to CVO");
    } finally {
      setForwardingId(null);
    }
  };

  const openBlob = (
    response,
    fileName,
    isDownload = false,
    mimeType = "application/octet-stream"
  ) => {
    const blob = new Blob([response.data], {
      type:
        response.headers?.["content-type"] ||
        mimeType ||
        "application/octet-stream",
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
      const response =
        await viewDogBreederDocument(document.id);

      openBlob(
        response,
        document.fileName,
        false,
        document.mimeType || "application/pdf"
      );
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
      const response =
        await downloadDogBreederDocument(document.id);

      openBlob(
        response,
        document.fileName,
        true,
        document.mimeType || "application/octet-stream"
      );
    } catch (error) {
      console.error("Document download error:", error);
      toast.error("Failed to download document");
    }
  };

  const registration =
    previewData?.registrationDetails ||
    previewData ||
    {};

  const breeder =
    previewData?.breederDetails || {};

  const facility =
    previewData?.facilityDetails || {};

  const declaration =
    previewData?.declarationDetails || {};

  const breeds = getArray(
    previewData?.breedDetails
  );

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
                  active={
                    column.attr ===
                    props.sortAttributeDirection.attr
                  }
                  direction={
                    column.attr ===
                    props.sortAttributeDirection.attr
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

            {showForwardAction && (
              <TableCell>Action</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row, index) => {
            const applicationId = getApplicationId(row);

            const forwarded =
              isForwardedToCvo(row) ||
              locallyForwardedIds.has(applicationId);

            const currentlyForwarding =
              forwardingId === applicationId;

            return (
              <TableRow key={applicationId || index}>
                {props.tableColumns.map(
                  (column, columnIndex) => (
                    <TableCell
                      key={column.attr || columnIndex}
                    >
                      {typeof column.render === "function"
                        ? column.render(row)
                        : String(
                            row[column.attr] ?? ""
                          )}
                    </TableCell>
                  )
                )}

                <TableCell>
                  {row.entityType === "DOG_BREEDER" ? (
                    <Tooltip title="Preview Dog Breeder Application">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          handlePreviewClick(row)
                        }
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
                        onClick={() =>
                          handleDownloadClick(row)
                        }
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {showForwardAction && (
                  <TableCell>
                    {row.entityType ===
                    "DOG_BREEDER" ? (
                      <Button
                        variant="contained"
                        size="small"
                        color={
                          forwarded
                            ? "inherit"
                            : "warning"
                        }
                        disabled={
                          forwarded ||
                          currentlyForwarding
                        }
                        onClick={() =>
                          handleForwardClick(row)
                        }
                      >
                        {forwarded
                          ? "Forwarded"
                          : currentlyForwarding
                            ? "Forwarding..."
                            : "Forward to CVO"}
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}

          {props.rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={
                  (props.tableColumns?.length || 0) +
                  (showForwardAction ? 3 : 2)
                }
              >
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
        <DialogTitle>
          Dog Breeder Application Preview
        </DialogTitle>

        <DialogContent dividers>
          {previewLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 3,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <SectionTitle>
                Registration Details
              </SectionTitle>

              <Grid container spacing={2}>
                <PreviewRow
                  label="Application ID"
                  value={
                    registration.id ||
                    registration.applicationId
                  }
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
                  value={
                    registration.status?.name ||
                    registration.status?.statusName ||
                    registration.statusName ||
                    registration.statusId
                  }
                />

                <PreviewRow
                  label="District"
                  value={
                    registration.district?.name ||
                    registration.district
                      ?.districtName ||
                    registration.districtName ||
                    registration.districtId
                  }
                />

                <PreviewRow
                  label="Applicant User ID"
                  value={registration.applicantUserId}
                />
              </Grid>

              <SectionTitle>
                Breeder Details
              </SectionTitle>

              <Grid container spacing={2}>
                <PreviewRow
                  label="Breeder Name"
                  value={breeder.breederName}
                />

                <PreviewRow
                  label="Address Line 1"
                  value={breeder.addressLine1}
                />

                <PreviewRow
                  label="Address Line 2"
                  value={breeder.addressLine2}
                />

                <PreviewRow
                  label="City"
                  value={breeder.city}
                />

                <PreviewRow
                  label="Pincode"
                  value={breeder.pincode}
                />

                <PreviewRow
                  label="Mobile"
                  value={breeder.contactMobile}
                />

                <PreviewRow
                  label="Email"
                  value={breeder.contactEmail}
                />

                <PreviewRow
                  label="Facility Details"
                  value={breeder.facilityDetails}
                />

                <PreviewRow
                  label="Total Dogs Count"
                  value={breeder.totalDogsCount}
                />
              </Grid>

              <SectionTitle>
                Facility Details
              </SectionTitle>

              <Grid container spacing={2}>
                <PreviewRow
                  label="Accommodation Infrastructure"
                  value={
                    facility.accommodationInfrastructure
                  }
                />

                <PreviewRow
                  label="Working Hours"
                  value={facility.workingHours}
                />

                <PreviewRow
                  label="Rest Day"
                  value={facility.restDay}
                />

                <PreviewRow
                  label="Ventilation Arrangement"
                  value={
                    facility.ventilationArrangement
                  }
                />

                <PreviewRow
                  label="Lighting Arrangement"
                  value={facility.lightingArrangement}
                />

                <PreviewRow
                  label="Heating / Cooling Arrangement"
                  value={
                    facility.heatingCoolingArrangement
                  }
                />

                <PreviewRow
                  label="Food Storage Arrangement"
                  value={
                    facility.foodStorageArrangement
                  }
                />

                <PreviewRow
                  label="Cleanliness / Waste Arrangement"
                  value={
                    facility.cleanlinessWasteArrangement
                  }
                />

                <PreviewRow
                  label="Dead Animal Disposal"
                  value={
                    facility.deadAnimalDisposalArrangement
                  }
                />

                <PreviewRow
                  label="Veterinary Support"
                  value={
                    facility.veterinarySupportArrangement
                  }
                />

                <PreviewRow
                  label="Cage / Enclosure Details"
                  value={
                    facility.cageEnclosureDetails
                  }
                />
              </Grid>

              <SectionTitle>
                Declaration Details
              </SectionTitle>

              <Grid container spacing={2}>
                <PreviewRow
                  label="Qualification / Experience"
                  value={
                    declaration.qualificationExperience
                  }
                />

                <PreviewRow
                  label="Declaration Accepted"
                  value={
                    declaration.declarationAccepted
                      ? "Yes"
                      : "No"
                  }
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

                <PreviewRow
                  label="Signed At"
                  value={declaration.signedAt}
                />
              </Grid>

              <SectionTitle>
                Breed Details
              </SectionTitle>

              {breeds.length === 0 ? (
                <Typography>
                  No breed details found
                </Typography>
              ) : (
                breeds.map((breed, index) => (
                  <Box
                    key={breed.id || index}
                    sx={{ mb: 2 }}
                  >
                    <Grid container spacing={2}>
                      <PreviewRow
                        label="Breed Name"
                        value={breed.breedName}
                      />

                      <PreviewRow
                        label="Dog Count"
                        value={breed.dogCount}
                      />

                      <PreviewRow
                        label="Age Description"
                        value={breed.ageDescription}
                      />
                    </Grid>

                    {index !== breeds.length - 1 && (
                      <Divider sx={{ mt: 1 }} />
                    )}
                  </Box>
                ))
              )}

              <SectionTitle>
                Documents
              </SectionTitle>

              {documents.length === 0 ? (
                <Typography>
                  No documents uploaded
                </Typography>
              ) : (
                documents.map((document, index) => (
                  <Box
                    key={document.id || index}
                    sx={{
                      mb: 1.5,
                      pb: 1.5,
                      borderBottom:
                        "1px solid rgba(255,255,255,0.12)",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: 700 }}
                      >
                        {getValue(
                          document.documentTypeName ||
                            document.documentType
                              ?.name ||
                            document.documentTypeId
                        )}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        File Name:{" "}
                        {getValue(document.fileName)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Mime Type:{" "}
                        {getValue(document.mimeType)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Size:{" "}
                        {getValue(
                          document.fileSizeBytes
                        )}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          handleViewDocument(document)
                        }
                      >
                        View
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                          handleDownloadDocument(
                            document
                          )
                        }
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
          <Button onClick={handleClosePreview}>
            Close
          </Button>
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
  refreshList: PropTypes.func,
  handleRefresh: PropTypes.func,
  showForwardAction: PropTypes.bool,
};

List.defaultProps = {
  rows: [],
  tableColumns: [],
  handleSortClick: () => {},
  sortAttributeDirection: {
    attr: "",
    direction: "asc",
  },
  refreshList: undefined,
  handleRefresh: undefined,
  showForwardAction: undefined,
};

export default List;

