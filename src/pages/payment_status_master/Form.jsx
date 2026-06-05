import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";
import useForm from "../../hooks/useForm";

const Form = (props) => {
  const formFields = {
    id: "",
    statusCode: "",
    statusName: "",
    displayOrder: "",
    active: true,
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
    } else if (props.operationType === "edit") {
      await handleUpdate(formValues);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Status Code"
              name="statusCode"
              value={formValues.statusCode}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Status Name"
              name="statusName"
              value={formValues.statusName}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Display Order"
              name="displayOrder"
              value={formValues.displayOrder}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <FormButtons
              operationType={props.operationType}
              onCancelClick={props.handleCloseFormModal}
              disabled={isSubmitting || props.canSave === false}
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
  rowID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  canSave: PropTypes.bool,
};

export default Form;