import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import DropDown from "../../components/FormComponents/DropDown";
import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";
import useForm from "../../hooks/useForm";
import { useEffect } from "react";
const Form = (props) => {
  const formFields = {
  id: "",
  applicationNumber: "",
  entityType: "PET_SHOP",
  applicationKind: "NEW",

  status: null,
  district: null,
  applicantUser: null,
  assignedOffice: null,
  cvOffice: null,
  payment: null,

  statusId: "",
  districtId: "",
  applicantUserId: "",
  assignedOfficeId: "",
  cvOfficeId: "",
  paymentId: "",

  submittedAt: "",
  forwardedToCvoAt: "",
  forwardedToCvoBy: "",
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
    props.operationType
  );
  useEffect(() => {
  if (!props.dropDownLists) return;

  if (formValues.statusId && !formValues.status) {
    const statusObj = props.dropDownLists.status?.find(
      (x) => Number(x.id) === Number(formValues.statusId)
    );

    if (statusObj) {
      handleChangeDropDown(null, statusObj, "status");
    }
  }

  if (formValues.districtId && !formValues.district) {
    const districtObj = props.dropDownLists.district?.find(
      (x) => Number(x.id) === Number(formValues.districtId)
    );

    if (districtObj) {
      handleChangeDropDown(null, districtObj, "district");
    }
  }

  if (formValues.assignedOfficeId && !formValues.assignedOffice) {
    const officeObj = props.dropDownLists.assignedOffice?.find(
      (x) => Number(x.id) === Number(formValues.assignedOfficeId)
    );

    if (officeObj) {
      handleChangeDropDown(null, officeObj, "assignedOffice");
    }
  }

  if (formValues.cvOfficeId && !formValues.cvOffice) {
    const officeObj = props.dropDownLists.cvOffice?.find(
      (x) => Number(x.id) === Number(formValues.cvOfficeId)
    );

    if (officeObj) {
      handleChangeDropDown(null, officeObj, "cvOffice");
    }
  }
}, [
  formValues.statusId,
  formValues.districtId,
  formValues.assignedOfficeId,
  formValues.cvOfficeId,
  props.dropDownLists,
]);

  const handleSubmit = async (event) => {
  event.preventDefault();

  const payload = {
    ...formValues,

    statusId: formValues.status?.id || null,
    districtId: formValues.district?.id || null,
    applicantUserId: formValues.applicantUser?.id || null,
    assignedOfficeId: formValues.assignedOffice?.id || null,
    cvOfficeId: formValues.cvOffice?.id || null,
    paymentId: formValues.payment?.id || null,
  };

  console.log("Submitting Payload:", payload);

  if (props.operationType === "insert") {
    await handleInsert(payload);
  } else if (props.operationType === "edit") {
    await handleUpdate(payload);
  }
};

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Application Number"
              name="applicationNumber"
              value={formValues.applicationNumber}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Entity Type"
              name="entityType"
              value={formValues.entityType}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Application Kind"
              name="applicationKind"
              value={formValues.applicationKind}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DropDown
  name="status"
  formValues={formValues}
  onChange={handleChangeDropDown}
  list={props.dropDownLists?.status || []}
  label="Status"
  errors={errors}
/>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DropDown
  name="district"
  formValues={formValues}
  onChange={handleChangeDropDown}
  list={props.dropDownLists?.district || []}
  label="District"
  errors={errors}
/>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DropDown
  name="applicantUser"
  formValues={formValues}
  onChange={handleChangeDropDown}
  list={props.dropDownLists?.applicantUser || []}
  label="Applicant User"
  errors={errors}
/>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DropDown
  name="assignedOffice"
  formValues={formValues}
  onChange={handleChangeDropDown}
  list={props.dropDownLists?.assignedOffice || []}
  label="Assigned Office"
  errors={errors}
/>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DropDown
  name="cvOffice"
  formValues={formValues}
  onChange={handleChangeDropDown}
  list={props.dropDownLists?.cvOffice || []}
  label="CV Office"
  errors={errors}
/>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DropDown
  name="payment"
  formValues={formValues}
  onChange={handleChangeDropDown}
  list={props.dropDownLists?.payment || []}
  label="Payment"
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
  dropDownLists: PropTypes.object,
};

export default Form;