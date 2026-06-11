import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";

import useForm from "../../hooks/useForm";

const Form = (props) => {
  const formFields = {
    id: "",
    moduleName: "PET_SHOP",
    applicationId: "",
    actionBy: "",
    remarks: "",
  };

  const {
    formValues,
    errors,
    isSubmitting,
    handleChangeFormValues,
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (props.operationType === "insert") {
      await handleInsert(formValues);
    } else {
      await handleUpdate(formValues);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Module Name"
              name="moduleName"
              value={formValues.moduleName}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Application ID"
              name="applicationId"
              value={formValues.applicationId}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Action By"
              name="actionBy"
              value={formValues.actionBy}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Remarks"
              name="remarks"
              value={formValues.remarks}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormButtons
              operationType={props.operationType}
              onCancelClick={props.handleCloseFormModal}
              disabled={isSubmitting}
              isAddAnotherRequired={false}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

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
};

export default Form;