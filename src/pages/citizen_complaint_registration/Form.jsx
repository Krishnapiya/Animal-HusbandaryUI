import PropTypes from "prop-types";
import { useRef } from "react";
import { toast } from "material-react-toastify";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";

import useForm from "../../hooks/useForm";
import { addFormDataItem } from "../../api-client/apiCall";

const Form = (props) => {

  // =========================================================
  // FORM FIELDS
  // =========================================================

  const formFields = {
    id: "",
    complaintNumber: "",
    placeOfIncident: "",
    petAnimalName: "",
    incidentDate: "",
    complaintDescription: "",

    // These are frontend-only fields.
    // They must NOT be sent to complaint-registration/save.
    photoPath: null,
    videoPath: null,
    documentPath: null,
  };

  // =========================================================
  // FORM HOOK
  // =========================================================

  const {
    formValues,
    errors,
    isSubmitting,
    handleChangeFormValues,
    handleChangeFiles,
    handleInsert,
    handleUpdate,
  } = useForm(
    formFields,
    null,
    props.api_url,
    props.alertString,
    props.handleCloseFormModal,
    props.handleRefreshTable,
    props.rowID,
    props.operationType
  );

  // =========================================================
  // FILE INPUT REFERENCES
  // =========================================================

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // =========================================================
  // DOCUMENT UPLOAD ENDPOINT
  // =========================================================

  const DOCUMENT_UPLOAD_URL =
    "/citizen/auth/complaint-document/upload";

  // =========================================================
  // DOCUMENT TYPE IDs
  // =========================================================
  //
  // IMPORTANT:
  // We have already confirmed documentTypeId = 1 works
  // from your Postman test.
  //
  // Once we check your document_type table, we can replace
  // these with the exact Photo / Video / Document IDs.
  //
  // =========================================================

  const PHOTO_DOCUMENT_TYPE_ID = 1;
  const VIDEO_DOCUMENT_TYPE_ID = 1;
  const DOCUMENT_DOCUMENT_TYPE_ID = 1;

  // =========================================================
  // UPLOAD ONE DOCUMENT
  // =========================================================

  const uploadComplaintDocument = async (
    file,
    complaintId,
    documentTypeId
  ) => {

    if (!file) {
      return true;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("complaintId", complaintId);
    formData.append(
      "documentTypeId",
      documentTypeId
    );

    // TEMPORARY
    // We will later take this from the logged-in user.
    formData.append("uploadedBy", 1);

    console.log(
      "Uploading complaint document:",
      {
        fileName: file.name,
        complaintId: complaintId,
        documentTypeId: documentTypeId,
      }
    );

    const response = await addFormDataItem(
      DOCUMENT_UPLOAD_URL,
      formData,
      true
    );

    if (!response?.isSuccess) {

      console.error(
        "Document upload failed:",
        response
      );

      toast.error(
        `Failed to upload ${file.name}`
      );

      return false;
    }

    console.log(
      "Document uploaded successfully:",
      response.data
    );

    return true;
  };

  // =========================================================
  // UPLOAD ALL SELECTED DOCUMENTS
  // =========================================================

  const uploadComplaintDocuments = async (
    complaintId
  ) => {

    let allUploaded = true;

    // -------------------------------------------------------
    // PHOTO
    // -------------------------------------------------------

    if (formValues.photoPath) {

      const uploaded =
        await uploadComplaintDocument(
          formValues.photoPath,
          complaintId,
          PHOTO_DOCUMENT_TYPE_ID
        );

      if (!uploaded) {
        allUploaded = false;
      }
    }

    // -------------------------------------------------------
    // VIDEO
    // -------------------------------------------------------

    if (formValues.videoPath) {

      const uploaded =
        await uploadComplaintDocument(
          formValues.videoPath,
          complaintId,
          VIDEO_DOCUMENT_TYPE_ID
        );

      if (!uploaded) {
        allUploaded = false;
      }
    }

    // -------------------------------------------------------
    // DOCUMENT
    // -------------------------------------------------------

    if (formValues.documentPath) {

      const uploaded =
        await uploadComplaintDocument(
          formValues.documentPath,
          complaintId,
          DOCUMENT_DOCUMENT_TYPE_ID
        );

      if (!uploaded) {
        allUploaded = false;
      }
    }

    return allUploaded;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    // =======================================================
    // INSERT
    // =======================================================

    if (props.operationType === "insert") {

      // -----------------------------------------------------
      // IMPORTANT:
      // Create a copy containing ONLY complaint fields.
      // -----------------------------------------------------

      const complaintData = {
        ...formValues,
      };

      // Remove frontend-only file fields.
      delete complaintData.photoPath;
      delete complaintData.videoPath;
      delete complaintData.documentPath;

      console.log(
        "Saving complaint:",
        complaintData
      );

      // -----------------------------------------------------
      // STEP 1
      // Save complaint
      // -----------------------------------------------------

      const response =
        await handleInsert(complaintData);

      console.log(
        "Complaint save response:",
        response
      );

      if (!response?.isSuccess) {
        return;
      }

      // -----------------------------------------------------
      // STEP 2
      // Get newly created complaint ID
      // -----------------------------------------------------

      const complaintId =
        response.data?.payLoad?.id ||
        response.data?.payload?.id;

      console.log(
        "Created Complaint ID:",
        complaintId
      );

      if (!complaintId) {

        toast.error(
          "Complaint created, but Complaint ID was not returned."
        );

        return;
      }

      // -----------------------------------------------------
      // STEP 3
      // Upload documents
      // -----------------------------------------------------

      const documentsUploaded =
        await uploadComplaintDocuments(
          complaintId
        );

      // -----------------------------------------------------
      // STEP 4
      // Result
      // -----------------------------------------------------

      if (documentsUploaded) {

        toast.success(
          "Complaint and evidence saved successfully"
        );

      } else {

        toast.warning(
          "Complaint saved, but one or more evidence files failed to upload."
        );
      }

      return;
    }

    // =======================================================
    // EDIT
    // =======================================================

    if (props.operationType === "edit") {

      const complaintData = {
        ...formValues,
      };

      // File fields are handled separately.
      delete complaintData.photoPath;
      delete complaintData.videoPath;
      delete complaintData.documentPath;

      await handleUpdate(
        complaintData
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box sx={{ flexGrow: 1 }}>

      <form onSubmit={handleSubmit}>

        {/* =================================================
            HEADER
        ================================================= */}

        <Box sx={{ mb: 3 }}>

          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
          >
            🐾 Citizen Complaint Registration
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Fill in the complaint details below.
            Fields marked with * are mandatory.
          </Typography>

        </Box>

        {/* =================================================
            COMPLAINT DETAILS
        ================================================= */}

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
          }}
        >

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Complaint Details
          </Typography>

          <Grid
            container
            spacing={2}
          >

            {/* PLACE */}

            <Grid
              size={{ xs: 12, md: 6 }}
            >

              <TextInput
                label="Place of Incident"
                name="placeOfIncident"
                value={
                  formValues.placeOfIncident
                }
                onChange={
                  handleChangeFormValues
                }
                errors={errors}
                required
              />

            </Grid>

            {/* ANIMAL */}

            <Grid
              size={{ xs: 12, md: 6 }}
            >

              <TextInput
                label="Pet / Animal Name"
                name="petAnimalName"
                value={
                  formValues.petAnimalName
                }
                onChange={
                  handleChangeFormValues
                }
                errors={errors}
              />

            </Grid>

            {/* INCIDENT DATE */}

            <Grid
              size={{ xs: 12, md: 6 }}
            >

              <TextInput
                label="Incident Date"
                type="date"
                name="incidentDate"
                value={
                  formValues.incidentDate
                }
                onChange={
                  handleChangeFormValues
                }
                errors={errors}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />

            </Grid>

            {/* CATEGORY */}

            <Grid
              size={{ xs: 12, md: 6 }}
            >

              <TextInput
                label="Complaint Category"
                value="Animal Complaint"
                disabled
              />

            </Grid>

          </Grid>

        </Paper>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
          }}
        >

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Complaint Description
          </Typography>

          <TextInput
            label="Describe the complaint"
            name="complaintDescription"
            value={
              formValues.complaintDescription
            }
            onChange={
              handleChangeFormValues
            }
            errors={errors}
            multiline
            rows={6}
            required
          />

        </Paper>

        {/* =================================================
            EVIDENCE
        ================================================= */}

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
          }}
        >

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Evidence (Optional)
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            You can attach a photo, video, or supporting
            document related to the complaint.
          </Typography>

          <Grid
            container
            spacing={2}
          >

            {/* =================================================
                PHOTO
            ================================================= */}

            <Grid
              size={{ xs: 12, md: 4 }}
            >

              <input
                type="file"
                hidden
                accept="image/*"
                ref={photoInputRef}
                onChange={(event) => {

                  const file =
                    event.target.files?.[0];

                  if (file) {

                    handleChangeFiles(
                      file,
                      "photoPath"
                    );
                  }
                }}
              />

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  height: 55,
                  textTransform: "none",
                }}
                onClick={() =>
                  photoInputRef.current?.click()
                }
              >

                {formValues.photoPath
                  ? `📷 ${formValues.photoPath.name}`
                  : "📷 Upload Photo"}

              </Button>

            </Grid>

            {/* =================================================
                VIDEO
            ================================================= */}

            <Grid
              size={{ xs: 12, md: 4 }}
            >

              <input
                type="file"
                hidden
                accept="video/*"
                ref={videoInputRef}
                onChange={(event) => {

                  const file =
                    event.target.files?.[0];

                  if (file) {

                    handleChangeFiles(
                      file,
                      "videoPath"
                    );
                  }
                }}
              />

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  height: 55,
                  textTransform: "none",
                }}
                onClick={() =>
                  videoInputRef.current?.click()
                }
              >

                {formValues.videoPath
                  ? `🎥 ${formValues.videoPath.name}`
                  : "🎥 Upload Video"}

              </Button>

            </Grid>

            {/* =================================================
                DOCUMENT
            ================================================= */}

            <Grid
              size={{ xs: 12, md: 4 }}
            >

              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                ref={documentInputRef}
                onChange={(event) => {

                  const file =
                    event.target.files?.[0];

                  if (file) {

                    handleChangeFiles(
                      file,
                      "documentPath"
                    );
                  }
                }}
              />

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  height: 55,
                  textTransform: "none",
                }}
                onClick={() =>
                  documentInputRef.current?.click()
                }
              >

                {formValues.documentPath
                  ? `📄 ${formValues.documentPath.name}`
                  : "📄 Upload Document"}

              </Button>

            </Grid>

          </Grid>

        </Paper>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <FormButtons
          operationType={
            props.operationType
          }
          onCancelClick={
            props.handleCloseFormModal
          }
          disabled={
            isSubmitting ||
            props.canSave === false
          }
          isAddAnotherRequired={false}
        />

      </form>

    </Box>
  );
};

// =========================================================
// PROP TYPES
// =========================================================

Form.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  handleCloseFormModal: PropTypes.func,
  handleRefreshTable: PropTypes.func,
  operationType: PropTypes.string,
  rowID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  canSave: PropTypes.bool,
};

export default Form;