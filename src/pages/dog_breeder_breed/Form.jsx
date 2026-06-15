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
    dogBreederDetail: null,
    breedName: "",
    dogCount: "",
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

    if (!formValues.dogBreederDetail?.id) {
      toast.error("Select dog breeder detail.");
      return;
    }

    if (!formValues.breedName || formValues.breedName.trim() === "") {
      toast.error("Enter breed name.");
      return;
    }

    if (formValues.dogCount === "" || formValues.dogCount === null) {
      toast.error("Enter dog count.");
      return;
    }

    if (Number(formValues.dogCount) < 0) {
      toast.error("Dog count cannot be negative.");
      return;
    }

    const payload = {
      ...formValues,
      dogCount: Number(formValues.dogCount),
    };

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
          <Grid size={{ xs: 12, sm: 6 }}>
            <DropDown
              name="dogBreederDetail"
              formValues={formValues}
              onChange={handleChangeDropDown}
              list={props.dropDownLists["dogBreederDetail"] || []}
              label="Dog Breeder Detail"
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput
              label="Breed Name"
              name="breedName"
              value={formValues.breedName}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextInput
              label="Dog Count"
              name="dogCount"
              type="number"
              value={formValues.dogCount}
              onChange={handleChangeFormValues}
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
  handleCloseFormModal: PropTypes.func,
  operationType: PropTypes.string,
  rowID: PropTypes.string,
  canSave: PropTypes.bool,
};

export default Form;