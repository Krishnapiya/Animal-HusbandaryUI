import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";
import useForm from "../../hooks/useForm";

const Form = (props) => {

  const formFields = {
  id: "",
  applicationId: "",
  breederName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  pincode: "",
  contactMobile: "",
  contactEmail: "",
  facilityDetails: "",
  totalDogsCount: "",
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
  label="Application ID"
  name="applicationId"
  value={formValues.applicationId}
  onChange={handleChangeFormValues}
  errors={errors}
/>

<TextInput
  label="Breeder Name"
  name="breederName"
  value={formValues.breederName}
  onChange={handleChangeFormValues}
  errors={errors}
  required
/>

<TextInput
  label="Address Line 1"
  name="addressLine1"
  value={formValues.addressLine1}
  onChange={handleChangeFormValues}
  errors={errors}
  required
/>

<TextInput
  label="Address Line 2"
  name="addressLine2"
  value={formValues.addressLine2}
  onChange={handleChangeFormValues}
  errors={errors}
/>

<TextInput
  label="City"
  name="city"
  value={formValues.city}
  onChange={handleChangeFormValues}
  errors={errors}
/>

<TextInput
  label="Pincode"
  name="pincode"
  value={formValues.pincode}
  onChange={handleChangeFormValues}
  errors={errors}
/>

<TextInput
  label="Contact Mobile"
  name="contactMobile"
  value={formValues.contactMobile}
  onChange={handleChangeFormValues}
  errors={errors}
/>

<TextInput
  label="Contact Email"
  name="contactEmail"
  value={formValues.contactEmail}
  onChange={handleChangeFormValues}
  errors={errors}
/>

<TextInput
  label="Facility Details"
  name="facilityDetails"
  value={formValues.facilityDetails}
  onChange={handleChangeFormValues}
  errors={errors}
/>

<TextInput
  label="Total Dogs Count"
  name="totalDogsCount"
  value={formValues.totalDogsCount}
  onChange={handleChangeFormValues}
  errors={errors}
/>

          <Grid size={{ xs: 12 }}>
            <FormButtons
              operationType={props.operationType}
              onCancelClick={props.handleCloseFormModal}
              disabled={isSubmitting || props.canSave === false}
              isAddAnotherRequired={false}
            />
          </Grid>
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