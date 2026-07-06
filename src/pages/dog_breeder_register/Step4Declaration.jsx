/* eslint-disable */
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Step4Declaration = ({
  formValues,
  errors,
  isSaving,
  onChange,
  onCheckboxChange,
  onBack,
  onSave,
}) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "#1e3a8a" }}
      >
        Step 4 - Declaration
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Qualification and experience in dog breeding"
            name="qualificationExperience"
            value={formValues.qualificationExperience || ""}
            onChange={onChange}
            error={Boolean(errors.qualificationExperience)}
            helperText={errors.qualificationExperience}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Place"
            name="declarationPlace"
            value={formValues.declarationPlace || ""}
            onChange={onChange}
            error={Boolean(errors.declarationPlace)}
            helperText={errors.declarationPlace}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="date"
            label="Declaration Date"
            name="declarationDate"
            value={formValues.declarationDate || ""}
            onChange={onChange}
            error={Boolean(errors.declarationDate)}
            helperText={errors.declarationDate}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Applicant Name"
            name="applicantName"
            value={formValues.applicantName || ""}
            onChange={onChange}
            error={Boolean(errors.applicantName)}
            helperText={errors.applicantName}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Signature Name"
            name="signatureName"
            value={formValues.signatureName || ""}
            onChange={onChange}
            error={Boolean(errors.signatureName)}
            helperText={errors.signatureName}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(formValues.declarationAccepted)}
                onChange={onCheckboxChange}
                name="declarationAccepted"
              />
            }
            label="I/We hereby declare that the information provided is accurate and true."
          />

          {errors.declarationAccepted && (
            <Typography variant="caption" color="error" display="block">
              {errors.declarationAccepted}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          disabled={isSaving}
          sx={{ textTransform: "none", backgroundColor: "#2563eb" }}
        >
          {isSaving ? "Saving..." : "Save Declaration"}
        </Button>
      </Box>
    </Box>
  );
};

export default Step4Declaration;