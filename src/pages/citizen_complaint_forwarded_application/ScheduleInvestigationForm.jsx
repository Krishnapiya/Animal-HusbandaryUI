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

const ScheduleInvestigationForm = ({
  complaintId,
  onClose,
  onSubmit,
}) => {
  const [investigationDate, setInvestigationDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [investigationDateVisible, setInvestigationDateVisible] = useState(false);

  const handleSchedule = () => {
    const investigationDetails = {
      complaintId,
      investigationDate,
      investigationRemarks: remarks,
      investigationDateVisible,
    };

    if (onSubmit) {
      onSubmit(investigationDetails);
    }
  };

  return (
    <Box p={2}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Investigation Date"
            InputLabelProps={{ shrink: true }}
            value={investigationDate}
            onChange={(e) =>
              setInvestigationDate(e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Remarks"
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={investigationDateVisible}
                onChange={(e) => setInvestigationDateVisible(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Show Investigation Date to Citizen
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {investigationDateVisible
                    ? "Citizen will be able to see the scheduled investigation date."
                    : "Surprise Visit: Date will remain hidden from the citizen until revealed."}
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
          disabled={!investigationDate}
        >
          Schedule Investigation
        </Button>
      </Box>
    </Box>
  );
};

ScheduleInvestigationForm.propTypes = {
  complaintId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default ScheduleInvestigationForm;