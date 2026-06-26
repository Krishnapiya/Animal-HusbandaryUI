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

const Step6PaymentSubmit = ({
  applicationId,
}) => {

  const handlePayment = () => {
    alert(
      "Payment Gateway Integration Pending"
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
          {applicationId}
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
          >
            Download Application
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

Step6PaymentSubmit.propTypes = {
  applicationId: PropTypes.any,
};

export default Step6PaymentSubmit;