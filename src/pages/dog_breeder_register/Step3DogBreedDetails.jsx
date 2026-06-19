/* eslint-disable */
import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Button,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import TextInput from "../../components/FormComponents/TextInput";

const Step3DogBreedDetails = ({
  formValues,
  errors,
  isSaving,
  onChange,
  onBack,
  onSave,
}) => {
  const dogBreederDetailId = Number(formValues?.dogBreederDetailId || 0);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: "Arial" }}>
        Section 3 — Dog breed details
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Details of dogs proposed to be bred in the establishment.
      </Typography>

      {!dogBreederDetailId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Dog breeder detail ID missing. Please save Step 1 first.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label=" Breed name"
            name="breedName"
            value={formValues.breedName || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="Number of dogs"
            name="dogCount"
            value={formValues.dogCount || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            label="Age of each dog"
            name="ageDescription"
            value={formValues.ageDescription || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ textTransform: "none" }}
        >
          Back to facility
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          endIcon={<NavigateNextIcon />}
          onClick={onSave}
          disabled={isSaving || !dogBreederDetailId}
          sx={{ textTransform: "none", backgroundColor: "#2563eb" }}
        >
          {isSaving ? "Saving..." : "Save & Continue"}
        </Button>
      </Box>
    </Box>
  );
};

Step3DogBreedDetails.propTypes = {
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Step3DogBreedDetails;