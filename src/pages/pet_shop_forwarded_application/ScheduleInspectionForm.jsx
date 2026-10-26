import PropTypes from "prop-types";
import { useState } from "react";

import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const ScheduleInspectionForm = ({
  applicationId,
  onClose,
  onSubmit,
}) => {
  const [inspectionDate, setInspectionDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [inspectionDateVisible, setInspectionDateVisible] = useState(false);

const handleSchedule = () => {
  const inspectionDetails = {
    applicationId,
    inspectionDate,
    remarks,
    inspectionRemarks: remarks,
    inspectionDateVisible,
  };

  if (onSubmit) {
    onSubmit(inspectionDetails);
  }
};

  return (
    <Box p={2}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Inspection Date"
            InputLabelProps={{ shrink: true }}
            value={inspectionDate}
            onChange={(e) => setInspectionDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={inspectionDateVisible}
                onChange={(e) => setInspectionDateVisible(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Show Inspection Date to Applicant
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {inspectionDateVisible
                    ? "Applicant will be able to see the scheduled inspection date."
                    : "Surprise Inspection: Date will remain hidden from applicant until revealed."}
                </Typography>
              </Box>
            }
          />
        </Grid>

      </Grid>

      <Box
        mt={3}
        display="flex"
        justifyContent="flex-end"
        gap={2}
      >
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSchedule}
        >
         Submit
        </Button>
      </Box>
    </Box>
  );
};

ScheduleInspectionForm.propTypes = {
  applicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default ScheduleInspectionForm;