/* eslint-disable */
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";
import DropDown from "../../components/FormComponents/DropDown";
import useForm from "../../hooks/useForm";
import { toast } from "material-react-toastify";

const Form = (props) => {
  const formFields = {
    fname: "",
    lname: "",
    email: "",
    mobileNo: "",
    username: "",
    password: "",
    role: null,
    office: null,
  };

  const {
    formValues,
    errors,
    isSubmitting,
    handleChangeFormValues,
    handleChangeDropDown,
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
    props.operationType,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.office?.id) {
      toast.error("Select an office.");
      return;
    }
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput
              label="First Name"
              name="fname"
              value={formValues.fname}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput
              label="Last Name"
              name="lname"
              value={formValues.lname}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput
              label="Mobile No"
              name="mobileNo"
              value={formValues.mobileNo}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput
              label="Username"
              name="username"
              value={formValues.username}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput
              label="Password"
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DropDown
              name="role"
              formValues={formValues}
              onChange={handleChangeDropDown}
              list={props.dropDownLists["role"]}
              label="Role"
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DropDown
              name="office"
              formValues={formValues}
              onChange={handleChangeDropDown}
              list={props.dropDownLists["office"] || []}
              label="Office"
              errors={errors}
            />
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <FormButtons
              operationType={props.operationType}
              onCancelClick={props.handleCloseFormModal}
              disabled={isSubmitting || props.canSave === false}
              isAddAnotherRequired={true}
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
  dropDownLists: PropTypes.object,
  handleRefreshTable: PropTypes.func,
  operationType: PropTypes.string,
  rowID: PropTypes.string,
  canSave: PropTypes.bool,
};

export default Form;
