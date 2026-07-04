import PropTypes from "prop-types";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import TextInput from "../../components/FormComponents/TextInput";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
const Step2FacilityInfrastructure = ({
  formValues,
  errors,
  onChange,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: "Arial" }}>
        Section 2 — Facility & Infrastructure
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Grid size={{ xs: 12 }}>
  <textarea
    name="accommodationInfrastructure"
    value={formValues.accommodationInfrastructure}
    onChange={onChange}
    placeholder="Accommodation Infrastructure"
    style={{
      width: "100%",
      minHeight: "120px",
      padding: "12px",
      background: "#ffffff",
      color: "#000000",
      border: "1px solid #666",
      borderRadius: "4px",
      resize: "vertical",
      fontSize: "14px",
      boxSizing: "border-box",
    }}
  />
</Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
  <Box sx={{ display: "flex", gap: 2 }}>
    <TextField
      fullWidth
      type="time"
      label="Opening Time"
      name="openingTime"
      value={formValues.openingTime || ""}
      onChange={onChange}
      InputLabelProps={{
        shrink: true,
      }}
    />

    <TextField
      fullWidth
      type="time"
      label="Closing Time"
      name="closingTime"
      value={formValues.closingTime || ""}
      onChange={onChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  </Box>
</Grid>
       

        <FormControl fullWidth>
  <InputLabel>Rest Days</InputLabel>

  <Select
    multiple
    name="restDay"
    value={formValues.restDay || []}
    onChange={onChange}
  >
    <MenuItem value="Monday">Monday</MenuItem>
    <MenuItem value="Tuesday">Tuesday</MenuItem>
    <MenuItem value="Wednesday">Wednesday</MenuItem>
    <MenuItem value="Thursday">Thursday</MenuItem>
    <MenuItem value="Friday">Friday</MenuItem>
    <MenuItem value="Saturday">Saturday</MenuItem>
    <MenuItem value="Sunday">Sunday</MenuItem>
  </Select>
</FormControl>

        <Grid size={{ xs: 12 }}>
          <textarea
  name="ventilationArrangement"
  value={formValues.ventilationArrangement}
  onChange={onChange}
  placeholder="Ventilation Arrangement"
  style={{
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    background: "#ffffff",
    color: "#000000",
    border: "1px solid #666",
    borderRadius: "4px",
    resize: "vertical",
    fontSize: "14px",
    boxSizing: "border-box",
  }}
/>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <textarea
  name="lightingArrangement"
  value={formValues.lightingArrangement}
  onChange={onChange}
  placeholder="Lighting Arrangement"
  style={{
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    background: "#ffffff",
    color: "#000000",
    border: "1px solid #666",
    borderRadius: "4px",
    resize: "vertical",
    fontSize: "14px",
    boxSizing: "border-box",
  }}
/>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            multiline
            rows={3}
            label="Fire Safety Arrangement"
            name="fireSafetyArrangement"
            value={formValues.fireSafetyArrangement}
            onChange={onChange}
            errors={errors}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <textarea
  name="heatingCoolingArrangement"
  value={formValues.heatingCoolingArrangement}
  onChange={onChange}
  placeholder="Heating / Cooling Arrangement"
  style={{
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    background: "#ffffff",
    color: "#000000",
    border: "1px solid #666",
    borderRadius: "4px",
    resize: "vertical",
    fontSize: "14px",
    boxSizing: "border-box",
  }}
/>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            multiline
            rows={3}
            label="Power Backup Arrangement"
            name="powerBackupArrangement"
            value={formValues.powerBackupArrangement}
            onChange={onChange}
            errors={errors}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            multiline
            rows={3}
            label="Food Storage Arrangement"
            name="foodStorageArrangement"
            value={formValues.foodStorageArrangement}
            onChange={onChange}
            errors={errors}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <textarea
  name="cleanlinessWasteArrangement"
  value={formValues.cleanlinessWasteArrangement}
  onChange={onChange}
  placeholder="Cleanliness & Waste Arrangement"
  style={{
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    background: "#ffffff",
    color: "#000000",
    border: "1px solid #666",
    borderRadius: "4px",
    resize: "vertical",
    fontSize: "14px",
    boxSizing: "border-box",
  }}
/>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            multiline
            rows={3}
            label="Dead Animal Disposal Arrangement"
            name="deadAnimalDisposalArrangement"
            value={formValues.deadAnimalDisposalArrangement}
            onChange={onChange}
            errors={errors}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            multiline
            rows={3}
            label="Veterinary Support Arrangement"
            name="veterinarySupportArrangement"
            value={formValues.veterinarySupportArrangement}
            onChange={onChange}
            errors={errors}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

Step2FacilityInfrastructure.propTypes = {
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Step2FacilityInfrastructure;