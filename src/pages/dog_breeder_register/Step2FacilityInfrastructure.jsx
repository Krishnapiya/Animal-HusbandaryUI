/* eslint-disable */
import PropTypes from "prop-types";
import {
  Alert,
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
  Button,
  TextField
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import TextInput from "../../components/FormComponents/TextInput";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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
          <TextField
            fullWidth
            type="time"
            label="2. Opening time"
            name="openingTime"
            value={values.openingTime || ""}
            onChange={onChange}
            error={Boolean(errors.openingTime)}
            helperText={errors.openingTime || ""}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="time"
            label="3. Closing time"
            name="closingTime"
            value={values.closingTime || ""}
            onChange={onChange}
            error={Boolean(errors.closingTime)}
            helperText={errors.closingTime || ""}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={Boolean(errors.holiday)} required>
            <InputLabel id="dog-breeder-holiday-label">
              4. Holiday
            </InputLabel>
            <Select
              labelId="dog-breeder-holiday-label"
              multiple
              label="4. Holiday"
              name="holiday"
              value={Array.isArray(values.holiday) ? values.holiday : []}
              onChange={(event) => {
                const value = event.target.value;

                onChange({
                  target: {
                    name: "holiday",
                    value:
                      typeof value === "string" ? value.split(",") : value,
                  },
                });
              }}
              renderValue={(selected) => selected.join(", ")}
            >
              {weekDays.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
            {errors.holiday && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.holiday}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
  <Typography sx={{ mb: 1, fontWeight: 500 }}>
    5. Ventilation available
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
      6. Lighting available
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
      7. Heating / Cooling available
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
      8. Food storage available
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
      9. Cleanliness / Waste available
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
      10. Dead animal disposal available
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
      11. Veterinary support available
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
            label="12. Cage / enclosure details"
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
