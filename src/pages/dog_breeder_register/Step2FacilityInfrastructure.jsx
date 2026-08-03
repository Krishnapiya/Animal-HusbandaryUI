/* eslint-disable */
import PropTypes from "prop-types";
import {
  Box,
  Grid2 as Grid,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
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
            label="3. Holiday"
            name="holiday"
            value={values.holiday || ""}
            onChange={onChange}
            errors={errors}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
  <Typography sx={{ mb: 1, fontWeight: 500 }}>
    4. Ventilation available
  </Typography>

  <RadioGroup
    row
    name="ventilationAvailable"
value={String(values.ventilationAvailable ?? false)}
    onChange={(e) =>
      onChange({
        target: {
          name: "ventilationAvailable",
          value: e.target.value === "true",
        },
      })
    }
  >
    <FormControlLabel
      value="true"
      control={<Radio />}
      label="Yes"
    />

    <FormControlLabel
      value="false"
      control={<Radio />}
      label="No"
    />
  </RadioGroup>
</FormControl>

{values.ventilationAvailable === true && (
    <TextInput
    label="Ventilation arrangement"
    name="ventilationArrangement"
    value={values.ventilationArrangement || ""}
    onChange={onChange}
    errors={errors}
    multiline
    minRows={3}
  />
)}
        </Grid>

     <Grid size={{ xs: 12, md: 6 }}>
  <FormControl fullWidth>
    <Typography sx={{ mb: 1, fontWeight: 500 }}>
      5. Lighting available
    </Typography>

    <RadioGroup
      row
      name="lightingAvailable"
      value={String(values.lightingAvailable)}
      onChange={(e) =>
        onChange({
          target: {
            name: "lightingAvailable",
            value: e.target.value === "true",
          },
        })
      }
    >
      <FormControlLabel
        value="true"
        control={<Radio />}
        label="Yes"
      />

      <FormControlLabel
        value="false"
        control={<Radio />}
        label="No"
      />
    </RadioGroup>
  </FormControl>

  {values.lightingAvailable && (
    <TextInput
      label="Lighting arrangement"
      name="lightingArrangement"
      value={values.lightingArrangement || ""}
      onChange={onChange}
      errors={errors}
      multiline
      minRows={3}
    />
  )}
</Grid>

     <Grid size={{ xs: 12, md: 6 }}>
  <FormControl fullWidth>
    <Typography sx={{ mb: 1, fontWeight: 500 }}>
      6. Heating / Cooling available
    </Typography>

    <RadioGroup
      row
      name="heatingCoolingAvailable"
      value={String(values.heatingCoolingAvailable)}
      onChange={(e) =>
        onChange({
          target: {
            name: "heatingCoolingAvailable",
            value: e.target.value === "true",
          },
        })
      }
    >
      <FormControlLabel
        value="true"
        control={<Radio />}
        label="Yes"
      />

      <FormControlLabel
        value="false"
        control={<Radio />}
        label="No"
      />
    </RadioGroup>
  </FormControl>

  {values.heatingCoolingAvailable && (
    <TextInput
      label="Heating / Cooling arrangement"
      name="heatingCoolingArrangement"
      value={values.heatingCoolingArrangement || ""}
      onChange={onChange}
      errors={errors}
      multiline
      minRows={3}
    />
  )}
</Grid>

      <Grid size={{ xs: 12, md: 6 }}>
  <FormControl fullWidth>
    <Typography sx={{ mb: 1, fontWeight: 500 }}>
      7. Food storage available
    </Typography>

    <RadioGroup
      row
      name="foodStorageAvailable"
      value={String(values.foodStorageAvailable)}
      onChange={(e) =>
        onChange({
          target: {
            name: "foodStorageAvailable",
            value: e.target.value === "true",
          },
        })
      }
    >
      <FormControlLabel
        value="true"
        control={<Radio />}
        label="Yes"
      />

      <FormControlLabel
        value="false"
        control={<Radio />}
        label="No"
      />
    </RadioGroup>
  </FormControl>

  {values.foodStorageAvailable && (
    <TextInput
      label="Food storage arrangement"
      name="foodStorageArrangement"
      value={values.foodStorageArrangement || ""}
      onChange={onChange}
      errors={errors}
      multiline
      minRows={3}
    />
  )}
</Grid>

        <Grid size={{ xs: 12, md: 6 }}>
  <FormControl fullWidth>
    <Typography sx={{ mb: 1, fontWeight: 500 }}>
      8. Cleanliness / Waste available
    </Typography>

    <RadioGroup
      row
      name="cleanlinessWasteAvailable"
      value={String(values.cleanlinessWasteAvailable)}
      onChange={(e) =>
        onChange({
          target: {
            name: "cleanlinessWasteAvailable",
            value: e.target.value === "true",
          },
        })
      }
    >
      <FormControlLabel
        value="true"
        control={<Radio />}
        label="Yes"
      />

      <FormControlLabel
        value="false"
        control={<Radio />}
        label="No"
      />
    </RadioGroup>
  </FormControl>

  {values.cleanlinessWasteAvailable && (
    <TextInput
      label="Cleanliness / Waste arrangement"
      name="cleanlinessWasteArrangement"
      value={values.cleanlinessWasteArrangement || ""}
      onChange={onChange}
      errors={errors}
      multiline
      minRows={3}
    />
  )}
</Grid>

      <Grid size={{ xs: 12, md: 6 }}>
  <FormControl fullWidth>
    <Typography sx={{ mb: 1, fontWeight: 500 }}>
      9. Dead animal disposal available
    </Typography>

    <RadioGroup
      row
      name="deadAnimalDisposalAvailable"
      value={String(values.deadAnimalDisposalAvailable)}
      onChange={(e) =>
        onChange({
          target: {
            name: "deadAnimalDisposalAvailable",
            value: e.target.value === "true",
          },
        })
      }
    >
      <FormControlLabel
        value="true"
        control={<Radio />}
        label="Yes"
      />

      <FormControlLabel
        value="false"
        control={<Radio />}
        label="No"
      />
    </RadioGroup>
  </FormControl>

  {values.deadAnimalDisposalAvailable && (
    <TextInput
      label="Dead animal disposal arrangement"
      name="deadAnimalDisposalArrangement"
      value={values.deadAnimalDisposalArrangement || ""}
      onChange={onChange}
      errors={errors}
      multiline
      minRows={3}
    />
  )}
</Grid>

        <Grid size={{ xs: 12, md: 6 }}>
  <FormControl fullWidth>
    <Typography sx={{ mb: 1, fontWeight: 500 }}>
      10. Veterinary support available
    </Typography>

    <RadioGroup
      row
      name="veterinarySupportAvailable"
      value={String(values.veterinarySupportAvailable)}
      onChange={(e) =>
        onChange({
          target: {
            name: "veterinarySupportAvailable",
            value: e.target.value === "true",
          },
        })
      }
    >
      <FormControlLabel
        value="true"
        control={<Radio />}
        label="Yes"
      />

      <FormControlLabel
        value="false"
        control={<Radio />}
        label="No"
      />
    </RadioGroup>
  </FormControl>

  {values.veterinarySupportAvailable && (
    <TextInput
      label="Veterinary support arrangement"
      name="veterinarySupportArrangement"
      value={values.veterinarySupportArrangement || ""}
      onChange={onChange}
      errors={errors}
      multiline
      minRows={3}
    />
  )}
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