import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import axios from "axios";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getHeader } from "../../utils";

import { CITIZEN_COMPLAINT_API_URL } from "../../config/endpoints";

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const buildApiUrl = (baseUrl, endpointPath, id) => {
  const normalizedBaseUrl = String(baseUrl || "").replace(
    /\/+$/,
    ""
  );

  const normalizedEndpointPath = String(
    endpointPath || ""
  )
    .replace(/^\/+/g, "")
    .replace(/\/+$/g, "");

  const normalizedId = String(id || "").replace(
    /^\/+/g,
    ""
  );

  if (
    !normalizedBaseUrl ||
    !normalizedEndpointPath ||
    !normalizedId
  ) {
    return null;
  }

  return `${normalizedBaseUrl}/${normalizedEndpointPath}/${normalizedId}`;
};

const toCamelCase = (value) =>
  String(value).replace(
    /_([a-zA-Z])/g,
    (_, char) => char.toUpperCase()
  );

const normalizeDeepKeys = (input) => {
  if (Array.isArray(input)) {
    return input.map(normalizeDeepKeys);
  }

  if (input && typeof input === "object") {
    return Object.entries(input).reduce(
      (acc, [key, value]) => {
        const normalizedValue =
          normalizeDeepKeys(value);

        const camelKey = toCamelCase(key);

        acc[camelKey] = normalizedValue;

        if (camelKey !== key) {
          acc[key] = normalizedValue;
        }

        return acc;
      },
      {}
    );
  }

  return input;
};

const getPayload = (response) => {
  const responseData = response?.data ?? null;

  return (
    responseData?.payload ??
    responseData?.payLoad ??
    responseData?.data ??
    responseData ??
    null
  );
};

const getComplaintData = (payload) => {
  return (
    payload?.complaint ??
    payload?.complaintRegistration ??
    payload?.registration ??
    payload
  );
};

const getValue = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return "-";
};

const Form = ({ rowID, onClose }) => {
  const [complaint, setComplaint] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (
      rowID === undefined ||
      rowID === null ||
      rowID === ""
    ) {
      return;
    }

    const fetchComplaint = async () => {
      try {
        setLoading(true);

        const url = buildApiUrl(
          BASE_API_URL,
          CITIZEN_COMPLAINT_API_URL,
          rowID
        );

        console.log(
          "Citizen Complaint View URL:",
          url
        );

        console.log(
          "Citizen Complaint ID:",
          rowID
        );

        if (!url) {
          throw new Error(
            "Unable to build Citizen Complaint API URL."
          );
        }

        const response = await axios.get(url, {
          headers: getHeader(),
        });

        console.log(
          "Citizen Complaint Response:",
          response.data
        );

        const payload = getPayload(response);

        const complaintData =
          getComplaintData(payload);

        if (!complaintData) {
          console.warn(
            "Citizen complaint view returned no complaint data",
            response.data
          );
        }

        setComplaint(
          normalizeDeepKeys(complaintData)
        );
      } catch (error) {
        console.error(
          "Failed to load citizen complaint:",
          error
        );

        setComplaint(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [rowID]);

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={5}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!complaint) {
    return (
      <Box p={4}>
        <Typography>
          No complaint found.
        </Typography>

        <Box mt={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>
      </Box>
    );
  }

  const status =
    complaint?.status?.name ||
    complaint?.status?.statusName ||
    complaint?.status?.statusCode ||
    complaint?.statusName ||
    complaint?.statusCode ||
    "-";

  const citizenName = getValue(
    complaint?.citizenName,
    complaint?.citizen?.name,
    complaint?.citizen?.fullName,
    complaint?.applicantName,
    complaint?.applicant?.name
  );

  const complaintNumber = getValue(
    complaint?.complaintNumber,
    complaint?.complaintNo,
    complaint?.registrationNumber,
    complaint?.applicationNumber
  );

  const placeOfIncident = getValue(
    complaint?.placeOfIncident,
    complaint?.incidentPlace,
    complaint?.location,
    complaint?.place
  );

  const incidentDate = getValue(
    complaint?.incidentDate,
    complaint?.dateOfIncident,
    complaint?.complaintDate
  );

  const description = getValue(
    complaint?.description,
    complaint?.complaintDescription,
    complaint?.remarks,
    complaint?.details
  );

  const animalName = getValue(
    complaint?.animalName,
    complaint?.petName,
    complaint?.animal?.name,
    complaint?.pet?.name
  );

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          mb={3}
        >
          Citizen Complaint Details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Complaint Number
            </Typography>

            <Typography fontWeight={500}>
              {complaintNumber}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Citizen
            </Typography>

            <Typography fontWeight={500}>
              {citizenName}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Place of Incident
            </Typography>

            <Typography fontWeight={500}>
              {placeOfIncident}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Incident Date
            </Typography>

            <Typography fontWeight={500}>
              {incidentDate}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Animal / Pet
            </Typography>

            <Typography fontWeight={500}>
              {animalName}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Status
            </Typography>

            <Typography fontWeight={500}>
              {status}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Complaint Description
            </Typography>

            <Typography
              fontWeight={500}
              sx={{ whiteSpace: "pre-wrap" }}
            >
              {description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box
        mt={3}
        display="flex"
        justifyContent="flex-end"
        sx={{ width: "100%" }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={handleBack}
          disabled={!onClose}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

Form.propTypes = {
  rowID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  onClose: PropTypes.func,
};

export default Form;