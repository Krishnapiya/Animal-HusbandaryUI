import PropTypes from "prop-types";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";
import DropDown from "../../components/FormComponents/DropDown";
import FormButtons from "../../components/FormComponents/FormButtons";
import useForm from "../../hooks/useForm";

const Form = (props) => {
  const formFields = {
    id: "",
    officeType: "",
    name: "",
    parentId: null,
    parentName: "",
    parentOffice: null,
    districtId: null,
  };

  const {
    formValues,
    errors,
    isSubmitting,
    handleChangeFormValues,
    handleChangeDropDown,
    handleInsert,
    handleUpdate,
    setFormValues,
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

  useEffect(() => {
    if (formValues.parentOffice != null) {
      return;
    }
    if (formValues.parentId == null || formValues.parentId === "") {
      return;
    }
    setFormValues((prev) => ({
      ...prev,
      parentOffice: { id: prev.parentId, name: prev.parentName || "" },
    }));
  }, [formValues.parentId, formValues.parentName, formValues.parentOffice, setFormValues]);

  useEffect(() => {
  if (formValues.districtId == null) {
    return;
  }

  if (typeof formValues.districtId === "object") {
    return;
  }

  const district = props.dropDownLists?.district?.find(
    (d) => Number(d.id) === Number(formValues.districtId)
  );

  if (district) {
    setFormValues((prev) => ({
      ...prev,
      districtId: district,
    }));
  }
}, [
  formValues.districtId,
  props.dropDownLists,
  setFormValues,
]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      officeType: formValues.officeType,
      name: formValues.name,
      parentId: formValues.parentOffice?.id ?? null,
        districtId: formValues.districtId?.id ?? formValues.districtId ?? null,
    };
    if (props.operationType === "edit") {
      payload.id = formValues.id;
    }
    if (props.operationType === "insert") {
      await handleInsert(payload);
    } else if (props.operationType === "edit") {
      await handleUpdate(payload);
    }
  };

  const parentOptions = (props.dropDownLists?.parentOffice || []).filter(
    (o) => !formValues.id || Number(o.id) !== Number(formValues.id),
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Office type"
              name="officeType"
              value={formValues.officeType}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Office name"
              name="name"
              value={formValues.name}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DropDown
              name="parentOffice"
              formValues={formValues}
              onChange={handleChangeDropDown}
              list={parentOptions}
              label="Parent office"
              errors={errors}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <DropDown
              name="districtId"
              formValues={formValues}
              onChange={handleChangeDropDown}
              list={props.dropDownLists?.district || []}
              label="District"
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
  dropDownLists: PropTypes.object,
};

export default Form;
