import PropTypes from "prop-types";
import { useState } from "react";

import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const UploadInspectionReportForm = ({
  applicationId,
  onSubmit,
}) => {
  const [reportFile, setReportFile] = useState(null);
  const [remarks, setRemarks] = useState("");
const handleSubmit = (status) => {
  const reportDetails = {
    applicationId,
    reportFile,
    remarks,
    recommendation: status,
  };

  console.log(reportDetails);

if (onSubmit) {
  onSubmit(reportDetails);
}
};

  return (
    <Box p={2}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
      <Button
  variant="contained"
  component="label"
  fullWidth
>
  Upload Inspection Report

  <input
    hidden
    type="file"
    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    onChange={(e) => setReportFile(e.target.files[0])}
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
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </Grid>

  <Grid item xs={12}>
  <Typography variant="subtitle2" sx={{ mb: 1 }}>
    Recommendation
  </Typography>

  <Box
    display="flex"
    justifyContent="flex-end"
    gap={2}
  >
<Button
  variant="contained"
  color="success"
  disabled={!reportFile || !remarks.trim()}
  onClick={() => handleSubmit("APPROVED")}
>
  Approve  
</Button>

<Button
  variant="contained"
  color="error"
  disabled={!reportFile || !remarks.trim()}
  onClick={() => handleSubmit("REJECTED")}
>
  Reject
</Button>
  </Box>
</Grid>

      </Grid>


    </Box>
  );
};

UploadInspectionReportForm.propTypes = {
  applicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onSubmit: PropTypes.func,
};

export default UploadInspectionReportForm;