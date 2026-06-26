import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Grid2 as Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import TextInput from "../../components/FormComponents/TextInput";

const Step4DeclarationAffidavit = ({
  declaration,
  setDeclaration,
}) => {
  console.log(
  "STEP4 DECLARATION DATA",
  declaration
);
  const handleChange = (field, value) => {
    setDeclaration((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Step 4 - Declaration & Affidavit
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Declaration Place"
            value={declaration.declarationPlace || ""}
            onChange={(e) =>
              handleChange(
                "declarationPlace",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Declaration Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={declaration.declarationDate || ""}
            onChange={(e) =>
              handleChange(
                "declarationDate",
                e.target.value
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, mb: 1 }}
          >
            Declaration
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={
                  declaration.informationAccurate || false
                }
                onChange={(e) =>
                  handleChange(
                    "informationAccurate",
                    e.target.checked
                  )
                }
              />
            }
            label="I hereby declare that the information furnished in this application is true and correct to the best of my knowledge."
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, mb: 1 }}
          >
            Affidavit Acknowledgements
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={
                  declaration.affidavitRule2018Ack || false
                }
                onChange={(e) =>
                  handleChange(
                    "affidavitRule2018Ack",
                    e.target.checked
                  )
                }
              />
            }
            label="I have read and understood the Pet Shop Rules, 2018."
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={
                  declaration.affidavitAwbiRulesAck || false
                }
                onChange={(e) =>
                  handleChange(
                    "affidavitAwbiRulesAck",
                    e.target.checked
                  )
                }
              />
            }
            label="I agree to comply with all AWBI rules and regulations."
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={
                  declaration.affidavitConditionsAck || false
                }
                onChange={(e) =>
                  handleChange(
                    "affidavitConditionsAck",
                    e.target.checked
                  )
                }
              />
            }
            label="I agree to abide by all conditions imposed by the Board."
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={
                  declaration.affidavitCancellationAck || false
                }
                onChange={(e) =>
                  handleChange(
                    "affidavitCancellationAck",
                    e.target.checked
                  )
                }
              />
            }
            label="I understand that violation of rules may result in cancellation of registration."
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={
                  declaration.affidavitTruthAck || false
                }
                onChange={(e) =>
                  handleChange(
                    "affidavitTruthAck",
                    e.target.checked
                  )
                }
              />
            }
            label="I affirm that the statements made in this affidavit are true."
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            label="Name of Deponent"
            value={
              declaration.affidavitDeponentName || ""
            }
            onChange={(e) =>
              handleChange(
                "affidavitDeponentName",
                e.target.value
              )
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

Step4DeclarationAffidavit.propTypes = {
  declaration: PropTypes.object.isRequired,
  setDeclaration: PropTypes.func.isRequired,
};

export default Step4DeclarationAffidavit;