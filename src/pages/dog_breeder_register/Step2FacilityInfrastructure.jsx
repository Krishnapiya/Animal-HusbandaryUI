/* eslint-disable */
import PropTypes from "prop-types";
import { Box, Button, Grid2 as Grid, Typography, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import TextInput from "../../components/FormComponents/TextInput";

const Step2FacilityInfrastructure = ({
  formValues,
  errors,
  isSaving,
  dogBreederDetailId,
  onChange,
  onBack,
  onSave,
}) => {
  const values = formValues || {};

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: "Arial" }}>
        Section 2 — Facility & infrastructure
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Details of accommodation, working hours, ventilation, lighting,
        cleanliness, food storage, veterinary support and cage/enclosure
        facilities.
      </Typography>

      {!dogBreederDetailId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please save breeder details first.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextInput
            label="1. Accommodation infrastructure"
            name="accommodationInfrastructure"
            value={values.accommodationInfrastructure || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="2. Working hours"
            name="workingHours"
            value={values.workingHours || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="3. Rest day"
            name="restDay"
            value={values.restDay || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="4. Ventilation arrangement"
            name="ventilationArrangement"
            value={values.ventilationArrangement || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="5. Lighting arrangement"
            name="lightingArrangement"
            value={values.lightingArrangement || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="6. Heating / cooling arrangement"
            name="heatingCoolingArrangement"
            value={values.heatingCoolingArrangement || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="7. Food storage arrangement"
            name="foodStorageArrangement"
            value={values.foodStorageArrangement || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="8. Cleanliness / waste arrangement"
            name="cleanlinessWasteArrangement"
            value={values.cleanlinessWasteArrangement || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="9. Dead animal disposal arrangement"
            name="deadAnimalDisposalArrangement"
            value={values.deadAnimalDisposalArrangement || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="10. Veterinary support arrangement"
            name="veterinarySupportArrangement"
            value={values.veterinarySupportArrangement || ""}
            onChange={onChange}
            errors={errors}
            multiline
            minRows={3}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            label="11. Cage / enclosure details"
            name="cageEnclosureDetails"
            value={values.cageEnclosureDetails || ""}
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
          Back to edit
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

Step2FacilityInfrastructure.propTypes = {
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  dogBreederDetailId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Step2FacilityInfrastructure;