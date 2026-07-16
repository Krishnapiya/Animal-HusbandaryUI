import PropTypes from "prop-types";
import TextInput from "../../components/FormComponents/TextInput";
import TextField from "@mui/material/TextField";
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
} from "@mui/material";
const Step2FacilityInfrastructure = ({
  formValues,
  errors,
  onChange,
}) => {
 const renderArrangementField = (
  title,
  availableName,
  descriptionName
) => (
  <Grid size={{ xs: 12 }}>
    <Box
  sx={{
    py: 2,
    borderBottom: "1px solid #ececec",
  }}
>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
    sx={{
        fontWeight: 500,
        fontSize: "15px"
    }}
>
          {title}
        </Typography>

        <RadioGroup
          row
          name={availableName}
          value={String(formValues[availableName])}
          onChange={(e) =>
            onChange({
              target: {
                name: availableName,
                value: e.target.value === "true",
              },
            })
          }
        >
          <FormControlLabel
            value="true"
            control={<Radio size="small" />}
            label="Yes"
          />

          <FormControlLabel
            value="false"
            control={<Radio size="small" />}
            label="No"
          />
        </RadioGroup>
      </Box>

      {formValues[availableName] && (
        <Box sx={{ mt: 2 }}>
          <TextInput
            multiline
            rows={3}
            label="Description"
            name={descriptionName}
            value={formValues[descriptionName]}
            onChange={onChange}
            errors={errors}
          />
        </Box>
      )}
    </Box>
  </Grid>
);
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

{renderArrangementField(
  "Ventilation Arrangement",
  "ventilationAvailable",
  "ventilationArrangement"
)}

        {renderArrangementField(
  "Lighting Arrangement",
  "lightingAvailable",
  "lightingArrangement"
)}

        {renderArrangementField(
  "Fire Safety Arrangement",
  "fireSafetyAvailable",
  "fireSafetyArrangement"
)}

        {renderArrangementField(
  "Heating / Cooling Arrangement",
  "heatingCoolingAvailable",
  "heatingCoolingArrangement"
)}

{renderArrangementField(
  "Power Backup Arrangement",
  "powerBackupAvailable",
  "powerBackupArrangement"
)}

{renderArrangementField(
  "Food Storage Arrangement",
  "foodStorageAvailable",
  "foodStorageArrangement"
)}

 {renderArrangementField(
  "Cleanliness & Waste Arrangement",
  "cleanlinessWasteAvailable",
  "cleanlinessWasteArrangement"
)}

{renderArrangementField(
    "Carcass Disposal Arrangement",
  "deadAnimalDisposalAvailable",
  "deadAnimalDisposalArrangement"
)}
{renderArrangementField(
  "Veterinary Support Arrangement",
  "veterinarySupportAvailable",
  "veterinarySupportArrangement"
)}
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