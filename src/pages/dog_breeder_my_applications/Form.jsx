import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { getHeader } from "../../utils";
import {
  DOG_BREEDER_APPLICATION_PREVIEW_URL,
  DOG_BREEDER_DOCUMENT_VIEW_URL,
} from "../../config/endpoints";

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const buildApiUrl = (baseUrl, endpoint, id = "") => {
  const base = String(baseUrl || "").replace(/\/+$/, "");
  const path = String(endpoint || "").replace(/^\/+/, "").replace(/\/+$/, "");
  const value = String(id || "").replace(/^\/+/, "");

  if (!base || !path) return null;
  return value ? `${base}/${path}/${value}` : `${base}/${path}`;
};

const InfoField = ({ label, value }) => (
  <Box mb={1.5}>
    <Typography variant="caption" color="textSecondary" display="block">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight="600">
      {value || "-"}
    </Typography>
  </Box>
);

InfoField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const Form = ({ rowID }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!rowID) return;

    const loadApplication = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const url = buildApiUrl(
          BASE_API_URL,
          DOG_BREEDER_APPLICATION_PREVIEW_URL,
          rowID
        );

        const response = await axios.get(url, {
          headers: getHeader(),
        });

        const payload =
          response?.data?.payLoad || response?.data?.payload || response?.data;
        setData(payload);
      } catch (error) {
        console.error("Dog breeder application preview failed", error);
        setErrorMsg(
          error.response?.data?.resultString ||
            "Failed to load application details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [rowID]);

  // Handle viewing documents via Blob stream
  const handleViewDocument = async (docId) => {
    try {
      const viewUrl = buildApiUrl(
        BASE_API_URL,
        DOG_BREEDER_DOCUMENT_VIEW_URL,
        docId
      );

      const response = await axios.get(viewUrl, {
        headers: getHeader(),
        responseType: "blob",
      });

      const fileBlob = new Blob([response.data], {
        type: response.headers["content-type"] || "image/png",
      });

      const blobUrl = window.URL.createObjectURL(fileBlob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Document preview failed", error);
      alert("Unable to view document.");
    }
  };

  // Section extraction
  const reg = data?.registrationDetails;
  const breeder = data?.breederDetails;
  const facility = data?.facilityDetails;
  const breeds = data?.breedDetails || [];
  const docs = data?.documentDetails || [];

  return (
    <Box sx={{ width: "100%", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
      <DialogContent dividers sx={{ overflowY: "auto", p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={5}>
            <CircularProgress />
          </Box>
        ) : errorMsg ? (
          <Alert severity="error">{errorMsg}</Alert>
        ) : !data ? (
          <Typography p={2}>No application details found.</Typography>
        ) : (
          <Box>
            {/* 1. REGISTRATION DETAILS */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Registration Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <InfoField label="Application ID" value={reg?.id || rowID} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Application Number" value={reg?.applicationNumber} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Entity Type" value={reg?.entityType} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Application Kind" value={reg?.applicationKind} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Status" value={reg?.status?.name || reg?.status} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="District" value={reg?.district?.name || reg?.district} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Applicant User ID" value={reg?.applicantUserId} />
              </Grid>
            </Grid>

            {/* 2. BREEDER DETAILS */}
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }} gutterBottom>
              Breeder Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <InfoField label="Breeder Name" value={breeder?.breederName} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Address Line 1" value={breeder?.addressLine1} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Address Line 2" value={breeder?.addressLine2} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="City" value={breeder?.city} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Pincode" value={breeder?.pincode} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Mobile" value={breeder?.contactMobile} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Email" value={breeder?.contactEmail} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Facility Details" value={breeder?.facilityDetails} />
              </Grid>
              <Grid item xs={6} sm={4}>
                <InfoField label="Total Dogs Count" value={breeder?.totalDogsCount} />
              </Grid>
            </Grid>

            {/* 3. FACILITY DETAILS */}
            {facility && (
              <>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }} gutterBottom>
                  Facility Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InfoField label="Accommodation / Infrastructure" value={facility?.accommodationInfrastructure} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField label="Working Hours" value={facility?.workingHours} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField label="Ventilation Arrangement" value={facility?.ventilationArrangement} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField label="Lighting Arrangement" value={facility?.lightingArrangement} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField label="Veterinary Support" value={facility?.veterinarySupportArrangement} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField label="Cage / Enclosure Details" value={facility?.cageEnclosureDetails} />
                  </Grid>
                </Grid>
              </>
            )}

            {/* 4. BREED DETAILS */}
            {breeds.length > 0 && (
              <>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }} gutterBottom>
                  Breed Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Breed Name</strong></TableCell>
                        <TableCell><strong>Dog Count</strong></TableCell>
                        <TableCell><strong>Age Description</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {breeds.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.breedName}</TableCell>
                          <TableCell>{item.dogCount}</TableCell>
                          <TableCell>{item.ageDescription || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* 5. UPLOADED DOCUMENTS */}
            {docs.length > 0 && (
              <>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }} gutterBottom>
                  Uploaded Documents
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Document Type</strong></TableCell>
                        <TableCell><strong>File Name</strong></TableCell>
                        <TableCell align="center"><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {docs.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.documentTypeName || doc.documentType}</TableCell>
                          <TableCell>{doc.fileName}</TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewDocument(doc.id)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        )}
      </DialogContent>
    </Box>
  );
};

Form.propTypes = {
  rowID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Form;