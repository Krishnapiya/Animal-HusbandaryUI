import { useState } from "react";
import PropTypes from "prop-types";
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
import { toast } from "material-react-toastify";
import { downloadPetShopRegistrationApplication } from "../../api-client/petShopRegistration";

const Step6PaymentSubmit = ({
  applicationId,
}) => {
  const [isDownloading, setIsDownloading] =
    useState(false);

  const handlePayment = () => {
    alert(
      "Payment Gateway Integration Pending"
    );
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
        "Application PDF downloaded"
      );
      return;
    }

    toast.error(
      response.message ||
        "Failed to download application"
    );
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
          ₹500
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Please complete the payment
          to submit your application.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
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
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadApplication}
            disabled={!applicationId || isDownloading}
          >
            {isDownloading
              ? "Downloading..."
              : "Download Application"}
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

Step6PaymentSubmit.propTypes = {
  applicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default Step6PaymentSubmit;
