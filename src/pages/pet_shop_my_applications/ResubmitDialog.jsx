import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "material-react-toastify";
import {
    uploadResubmissionDocument,
    resubmitApplication,
} from "../../api-client/petShopRegistration";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const ResubmitDialog = ({ open, onClose, application }) => {
  const [remarks, setRemarks] = useState("");
const [documents, setDocuments] = useState([]);
const [, setUploading] = useState(false);

  const handleClose = () => {
    setRemarks("");
    setDocuments([]);
    onClose();
  };

const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (!files.length) return;

    try {

        setUploading(true);

        for (const file of files) {

           const response = await uploadResubmissionDocument({
    file,
    applicationId: application.id,
});

            if (!response.isSuccess) {
                toast.error(`Failed to upload ${file.name}`);
                continue;
            }

            const savedDocument =
                response.data.payLoad ??
                response.data.payload ??
                response.data;

            setDocuments((prev) => [
                ...prev,
                savedDocument,
            ]);

        }

        toast.success("Documents uploaded successfully");

    } catch (error) {

        console.error(error);
        toast.error("Document upload failed");

    } finally {

        setUploading(false);

    }

    event.target.value = "";

};

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

 const handleResubmit = async () => {

    try {

        const payload = {

            applicationId: application.id,

            remarks,

            documents: documents.map(doc => doc.filePath),

        };

        const response =
            await resubmitApplication(payload);

        if (!response.isSuccess) {

            toast.error("Failed to resubmit application");
            return;

        }

        toast.success("Application resubmitted successfully");

        handleClose();

        window.location.reload();

    } catch (error) {

        console.error(error);

        toast.error("Failed to resubmit application");

    }

};

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Resubmit Application
      </DialogTitle>

      <Divider />

      <DialogContent>

        <Box mt={2}>

          <Typography variant="subtitle2">
            Application Number
          </Typography>

          <Typography sx={{ mb: 2 }}>
            {application?.applicationNumber || "-"}
          </Typography>

          <Typography variant="subtitle2">
            Pet Shop
          </Typography>

          <Typography sx={{ mb: 3 }}>
            {application?.shopName || "-"}
          </Typography>

          {/* Rejection Remarks */}
          {application?.remarks && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                bgcolor: "#fff8e1",
              }}
            >
              <Typography
                variant="subtitle2"
                color="error"
                gutterBottom
              >
                Rejection Remarks
              </Typography>

              <Typography>
                {application.remarks}
              </Typography>
            </Paper>
          )}

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Remarks"
            placeholder="Enter remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <Box mt={4}>

            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Supporting Documents
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: "center",
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: "primary.main",
                mb: 2,
              }}
            >

              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadOutlinedIcon />}
              >
                Upload Documents

                <input
                  hidden
                  multiple
                  type="file"
                  onChange={handleFileUpload}
                />
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Supported formats:
                PDF, JPG, JPEG, PNG
              </Typography>

            </Paper>

            {documents.length > 0 && (

              <>

                <Typography
                  variant="subtitle2"
                  gutterBottom
                >
                  Uploaded Documents
                </Typography>

                <Paper variant="outlined">

                  <List>

                    {documents.map((doc, index) => (

                      <ListItem
                        key={index}
                        divider
                        secondaryAction={
                          <IconButton
                            color="error"
                            onClick={() => removeDocument(index)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        }
                      >

                        <DescriptionOutlinedIcon
                          sx={{ mr: 2 }}
                        />

                        <ListItemText
    primary={doc.fileName}
    secondary={doc.filePath}
/>

                      </ListItem>

                    ))}

                  </List>

                </Paper>

              </>

            )}

          </Box>

        </Box>

      </DialogContent>

      <Divider />

      <DialogActions>

        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleResubmit}
          disabled={documents.length === 0}
        >
          Resubmit Application
        </Button>

      </DialogActions>

    </Dialog>
  );
};

ResubmitDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  application: PropTypes.object,
};

export default ResubmitDialog;