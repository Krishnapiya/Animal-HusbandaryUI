import PropTypes from "prop-types";
import { useState } from "react";

import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const InvestigationActionForm = ({
  complaintId,
  onSubmit,
  onClose,
}) => {
  const [remarks, setRemarks] = useState("");
  const [reportFile, setReportFile] = useState(null);

  const handleSubmit = (recommendation) => {
    const actionDetails = {
      complaintId,
      remarks,
      recommendation,
      reportFile,
    };

    if (onSubmit) {
      onSubmit(actionDetails);
    }
  };

  return (
    <Box p={2}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Investigation Report
            <input
              hidden
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) =>
                setReportFile(e.target.files?.[0] || null)
              }
            />
          </Button>

          {reportFile && (
            <Typography sx={{ mt: 1 }}>
              Selected File: <b>{reportFile.name}</b>
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Investigation Remarks"
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            placeholder="Enter investigation findings and remarks"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Recommendation
          </Typography>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
  variant="contained"
  color="success"
  disabled={!reportFile || !remarks.trim()}
  onClick={() => handleSubmit("VERIFY")}
>
  VERIFY
</Button>

<Button
  variant="contained"
  color="error"
  disabled={!reportFile || !remarks.trim()}
  onClick={() => handleSubmit("REJECT")}
>
  REJECT
</Button>
          </Box>
        </Grid>

      </Grid>

      <Box
        mt={3}
        display="flex"
        justifyContent="flex-end"
        gap={2}
      >
        {onClose && (
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
        )}

      </Box>
    </Box>
  );
};

InvestigationActionForm.propTypes = {
  complaintId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
};

export default InvestigationActionForm;