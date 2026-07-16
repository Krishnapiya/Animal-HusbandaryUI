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

const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const Step6PaymentSubmit = ({
  applicationId,
  formValues,
  facilityForm,
  animals,
  declaration,
  documents,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
        `${String(BASE_API_URL).replace(/\/$/, "")}/petshop/auth/registration-application/submit/${applicationId}`,
        {},
        {
          headers: getHeader(),
        }
      );

      toast.success("Application submitted successfully.");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error("Submission failed.");
    }
  };

  const handleDownloadApplication = async () => {
    if (!applicationId) {
      toast.error("Please save your application before downloading.");
      return;
    }

    setIsDownloading(true);

    const response =
      await downloadPetShopRegistrationApplication(applicationId);

    setIsDownloading(false);

    if (response.isSuccess) {
      toast.success("Application package downloaded.");
    } else {
      toast.error(
        response.message || "Failed to download application."
      );
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          Payment & Submit
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography sx={{ mb: 2 }}>
          <b>Application ID :</b> {applicationId || "-"}
        </Typography>

        <Typography sx={{ mb: 2 }}>
          <b>Registration Fee :</b> ₹200
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Please complete the payment to submit your application.
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
            color={submitted ? "success" : "primary"}
            disabled={submitted}
            onClick={handleSubmit}
          >
            {submitted
              ? "APPLICATION SUBMITTED"
              : "SUBMIT APPLICATION"}
          </Button>

          <Button
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
            onClick={() =>
              setShowPreview(!showPreview)
            }
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