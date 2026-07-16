import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "material-react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Preview";
import axios from "axios";
import { getHeader } from "../../utils";
import { downloadPetShopRegistrationApplication } from "../../api-client/petShopRegistration";
import Step5Preview from "./Step5Preview";

const BASE_API_URL =
  import.meta.env.VITE_APP_BASE_API_URL;

/**
 * Step 6: payment, submit, preview, and download application package.
 *
 * @param {object} props component props
 * @param {string|number} [props.applicationId] saved application id
 * @param {object} [props.formValues] shop details
 * @param {object} [props.facilityForm] facility details
 * @param {array} [props.animals] proposed animals
 * @param {object} [props.declaration] declaration details
 * @param {object} [props.documents] uploaded documents map
 * @returns {JSX.Element}
 */
const Step6PaymentSubmit = ({
  applicationId,
  formValues,
  facilityForm,
  animals,
  declaration,
  documents,
}) => {
  console.log("applicationId =", applicationId);
console.log("formValues =", formValues);
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
const handlePayment = () => { alert("Payment Gateway Integration Pending");};
const handleSubmit = async () => {
  try {
    await axios.patch(
      `${BASE_API_URL.replace(/\/$/, "")}/petshop/auth/registration-application/submit/${applicationId}`,
      {},
      {
        headers: getHeader(),
      }
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handlePayment = () => {
    alert("Payment Gateway Integration Pending");
  };

  const handleSubmit = async () => {
    if (!applicationId) {
      toast.error("Please save your application before submitting");
      return;
    }

    try {
      await axios.patch(
        `${String(BASE_API_URL || "").replace(/\/$/, "")}/petshop/auth/registration-application/submit/${applicationId}`,
        {},
        {
          headers: getHeader(),
        }
      );

      toast.success("Application submitted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Submission failed.");
    }
  };

  const handleDownloadApplication = async () => {
    if (!applicationId) {
      toast.error(
        "Please save your application before downloading"
      );
      return;
    }

    setIsDownloading(true);

    const response =
      await downloadPetShopRegistrationApplication(
        applicationId
      );

    setIsDownloading(false);

    if (response.isSuccess) {
      toast.success(
        "Application package downloaded"
      );
      return;
    }

    toast.error(
      response.message ||
        "Failed to download application"
    );
  };

    toast.success("Application submitted successfully.");
    setSubmitted(true);

    // Optional: redirect after submit
    // navigate("/my-applications");

  } catch (error) {
    console.error(error);
    toast.error("Submission failed.");
  }
};
const buildApiUrl = (baseUrl, endpointPath, id) => {
  const normalizedBaseUrl = String(baseUrl || "").replace(/\/+$/, "");
  const normalizedEndpointPath = String(endpointPath || "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const normalizedId = String(id || "").replace(/^\/+/, "");

  return `${normalizedBaseUrl}/${normalizedEndpointPath}/${normalizedId}`;
};

const handleDownloadPdf = async () => {
  try {
    const url = buildApiUrl(
      BASE_API_URL,
      PET_SHOP_REGISTRATION_APPLICATION_DOWNLOAD_URL,
      applicationId
    );

    console.log("Download URL:", url);

    const response = await axios.get(url, {
      headers: getHeader(),
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `PetShopApplication-${applicationId}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("Download failed", err);
  }
};

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
          }}
        >
          Payment & Submit
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography sx={{ mb: 2 }}>
          <b>Application ID :</b>
          {" "}
          {applicationId || "-"}
        </Typography>

        <Typography sx={{ mb: 2 }}>
          <b>Registration Fee :</b>
          ₹200
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Please complete the payment
          to submit your application.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<PaymentIcon />}
            onClick={handlePayment}
          >
            Pay Now
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit Application
          </Button>

          <Button

  variant="contained"
  color={submitted ? "success" : "primary"}
  disabled={submitted}
  onClick={handleSubmit}
>
  {submitted ? "APPLICATION SUBMITTED" : "SUBMIT APPLICATION"}
</Button>

            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadApplication}
            disabled={!applicationId || isDownloading}
          >
            {isDownloading
              ? "Downloading..."
              : "Download Application"}
          </Button>


          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview
              ? "Hide Preview"
              : "Preview Application"}
          </Button>
        </Box>

        {showPreview && (
          <Box sx={{ mt: 4 }}>
            <Step5Preview
              formValues={formValues}
              facilityForm={facilityForm}
              animals={animals}
              declaration={declaration}
              supportingDocuments={Object.values(documents || {})}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadApplication}
                disabled={!applicationId || isDownloading}
              >
                {isDownloading
                  ? "Downloading..."
                  : "Download Package"}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

Step6PaymentSubmit.propTypes = {
  applicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  formValues: PropTypes.object,
  facilityForm: PropTypes.object,
  animals: PropTypes.array,
  declaration: PropTypes.object,
  documents: PropTypes.object,
};

export default Step6PaymentSubmit;
