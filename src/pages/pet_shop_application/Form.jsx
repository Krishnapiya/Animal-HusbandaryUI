import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { downloadPetShopRegistrationApplication } from "../../api-client/petShopRegistration";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";

import Step5Preview from "../pet_shop_register/Step5Preview";
import { getHeader } from "../../utils";
import { PET_SHOP_REGISTRATION_APPLICATION_VIEW_URL } from "../../config/endpoints";

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const buildApiUrl = (baseUrl, endpointPath, id) => {
  const normalizedBaseUrl = String(baseUrl || "").replace(/\/+$/, "");
  const normalizedEndpointPath = String(endpointPath || "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const normalizedId = String(id || "").replace(/^\/+/, "");

  if (!normalizedBaseUrl || !normalizedEndpointPath || !normalizedId) {
    return null;
  }

  return `${normalizedBaseUrl}/${normalizedEndpointPath}/${normalizedId}`;
};

const toCamelCase = (value) =>
  String(value).replace(/_([a-zA-Z])/g, (_, char) =>
    char.toUpperCase()
  );

const normalizeDeepKeys = (input) => {
  if (Array.isArray(input)) {
    return input.map(normalizeDeepKeys);
  }

  if (input && typeof input === "object") {
    return Object.entries(input).reduce((acc, [key, value]) => {
      const normalizedValue = normalizeDeepKeys(value);
      const camelKey = toCamelCase(key);

      acc[camelKey] = normalizedValue;
      if (camelKey !== key) {
        acc[key] = normalizedValue;
      }

      return acc;
    }, {});
  }

  return input;
};




const preparePreviewData = (application) => {
  if (!application) {
    return {
      formValues: {},
      facilityForm: {},
      animals: [],
      declaration: {},
      supportingDocuments: [],   // <-- add
    };
  }

  const normalizedApplication = normalizeDeepKeys(application);

  return {
    formValues:
      normalizedApplication.formValues &&
      Object.keys(normalizedApplication.formValues).length > 0
        ? normalizedApplication.formValues
        : normalizedApplication,

    facilityForm:
      normalizedApplication.facilityForm &&
      Object.keys(normalizedApplication.facilityForm).length > 0
        ? normalizedApplication.facilityForm
        : normalizedApplication,

    animals:
      normalizedApplication.animals ??
      normalizedApplication.petAnimals ??
      normalizedApplication.animalList ??
      normalizedApplication.animalDetails ??
      [],

    declaration:
      normalizedApplication.declaration || {
        declarationPlace:
          normalizedApplication.declarationPlace,
        declarationDate:
          normalizedApplication.declarationDate,
        affidavitDeponentName:
          normalizedApplication.affidavitDeponentName,
      },

    // ******** ADD THIS ********
    supportingDocuments:
      normalizedApplication.supportingDocuments ??
      normalizedApplication.applicationDocuments ??
      [],
  };
};

const Form = ({ rowID, onClose }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    if (rowID === undefined || rowID === null || rowID === "") return;

    const fetchApplication = async () => {
      try {
        setLoading(true);

        const url = buildApiUrl(
          BASE_API_URL,
          PET_SHOP_REGISTRATION_APPLICATION_VIEW_URL,
          rowID
        );

        console.log("FINAL URL:", url, "rowID:", rowID);

        const headers = getHeader();
        console.log("REQUEST HEADERS:", {
          authorization: headers?.Authorization ?? headers?.authorization,
          hasAuthorization:
            !!headers?.Authorization || !!headers?.authorization,
        });

        if (!url) {
          throw new Error(
            "Unable to build API URL. Check BASE_API_URL or endpoint constant."
          );
        }

        const response = await axios.get(url, { headers });

        const responseData = response?.data ?? null;
        const payload =
          responseData?.payload ??
          responseData?.payLoad ??
          responseData?.data ??
          responseData ??
          null;

        const applicationData =
          payload?.application ??
          payload?.registrationApplication ??
          payload ??
          null;

        if (!applicationData) {
          console.warn(
            "Registration application view returned no application data",
            response?.data
          );
        }

        setApplication(applicationData);
      } catch (error) {
        console.error("Failed to load application", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [rowID]);

const handleDownloadPdf = async () => {
  const response = await downloadPetShopRegistrationApplication(rowID);

  if (!response.isSuccess) {
    console.error(response.message);
  }
};

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  const previewData = preparePreviewData(application);

  return (
    <Box>
      <Box ref={previewRef}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : !application ? (
          <Box p={4}>
            <Typography>No application found.</Typography>
          </Box>
        ) : (
          <Step5Preview {...previewData} />
        )}
      </Box>

      <Box
        mt={3}
        display="flex"
        justifyContent="flex-end"
        gap={2}
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

        <Button
          startIcon={<DownloadIcon />}
          variant="contained"
          onClick={handleDownloadPdf}
          disabled={!application || loading}
        >
          Download PDF
        </Button>
      </Box>
    </Box>
  );
};

Form.propTypes = {
  rowID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func,
};

export default Form;