import PropTypes from "prop-types";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

const steps = [
  "Shop & owner details",
  "Facility & infrastructure",
  "Proposed animals",
  "Declaration & affidavit",
  "Documents",
  "Payment & submit",
];

const WizardStepper = ({ activeStep }) => (
  <Box sx={{ mb: 3 }}>
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
      Kerala State Animal Welfare Board — FORM-1 (Pet Shop Registration)
    </Typography>
  </Box>
);

WizardStepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
};

export default WizardStepper;
