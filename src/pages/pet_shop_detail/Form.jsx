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
    shopName: "",
    ownerName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    contactMobile: "",
    contactEmail: "",
    latitude: "",
    longitude: "",
    registrationDetails: "",
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
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Shop Name"
              name="shopName"
              value={formValues.shopName}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Owner Name"
              name="ownerName"
              value={formValues.ownerName}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Address Line 1"
              name="addressLine1"
              value={formValues.addressLine1}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Address Line 2"
              name="addressLine2"
              value={formValues.addressLine2}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="City"
              name="city"
              value={formValues.city}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Pincode"
              name="pincode"
              value={formValues.pincode}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Contact Mobile"
              name="contactMobile"
              value={formValues.contactMobile}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Contact Email"
              name="contactEmail"
              value={formValues.contactEmail}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextInput
              label="Latitude"
              name="latitude"
              value={formValues.latitude}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextInput
              label="Longitude"
              name="longitude"
              value={formValues.longitude}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Registration Details"
              name="registrationDetails"
              value={formValues.registrationDetails}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
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