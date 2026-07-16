import PropTypes from "prop-types";
import {
  Box,
  Step,
  StepButton,
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

const WizardStepper = ({
  activeStep,
  maxAccessibleStep = 0,
  onStepClick,
}) => (
  <Box sx={{ mb: 3 }}>
    <Stepper activeStep={activeStep} alternativeLabel nonLinear>
      {steps.map((label, index) => {
        const isAccessible = index <= maxAccessibleStep;

        return (
          <Step key={label} completed={index < activeStep}>
            <StepButton
              onClick={() => {
                if (isAccessible && onStepClick) {
                  onStepClick(index);
                }
              }}
              disabled={!isAccessible}
              sx={{
                cursor: isAccessible ? "pointer" : "default",
              }}
            >
              {label}
            </StepButton>
          </Step>
        );
      })}
    </Stepper>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
      Kerala State Animal Welfare Board — FORM-1 (Pet Shop Registration)
    </Typography>
  </Box>
);

WizardStepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
  maxAccessibleStep: PropTypes.number,
  onStepClick: PropTypes.func,
};

export default WizardStepper;
