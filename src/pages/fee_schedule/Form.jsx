import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";
import useForm from "../../hooks/useForm";

const Form = (props) => {
  const formFields = {
    id: "",
    entityType: "",
    feeKind: "",
    amount: "",
    currency: "INR",
    effectiveFrom: "",
    effectiveTo: "",
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
              label="Fee Kind"
              name="feeKind"
              value={formValues.feeKind}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Amount"
              name="amount"
              value={formValues.amount}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Currency"
              name="currency"
              value={formValues.currency}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Effective From"
              name="effectiveFrom"
              type="date"
              value={formValues.effectiveFrom}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Effective To"
              name="effectiveTo"
              type="date"
              value={formValues.effectiveTo}
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