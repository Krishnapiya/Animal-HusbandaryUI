import PropTypes from "prop-types";
import { useState } from "react";

import {
  Box,
  Button,
  Grid,
  TextField,
} from "@mui/material";

const ScheduleInspectionForm = ({
  applicationId,
  onClose,
  onSubmit,
}) => {
  const [inspectionDate, setInspectionDate] = useState("");
  const [remarks, setRemarks] = useState("");

const handleSchedule = () => {
  const inspectionDetails = {
    applicationId,
    inspectionDate,
    remarks,
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