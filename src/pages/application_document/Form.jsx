import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";
import useForm from "../../hooks/useForm";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const Form = (props) => {
  const formFields = {
    id: "",
    fileName: "",
    filePath: "",
    mimeType: "",
    fileSizeBytes: "",
    uploadedBy:  null,
    uploadedAt: "",
    applicationId: null,
    documentTypeId: null,
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
  const getOptionId = (option) => option?.id ?? option?.value ?? "";

const getOptionName = (option) =>
  option?.name || option?.label || option?.username || "";

const getSelectedOption = (options, id) => {
  return (
    options?.find(
      (item) => Number(getOptionId(item)) === Number(id)
    ) || null
  );
};

const handleDropdownChange = (name, value) => {
  handleChangeFormValues({
    target: {
      name,
      value: value ? getOptionId(value) : "",
    },
  });
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      fileName: formValues.fileName,
      filePath: formValues.filePath,
      mimeType: formValues.mimeType,
      fileSizeBytes: formValues.fileSizeBytes
        ? Number(formValues.fileSizeBytes)
        : null,
      uploadedBy: formValues.uploadedBy ? Number(formValues.uploadedBy) : null,
      uploadedAt: formValues.uploadedAt
        ? formValues.uploadedAt.length === 16
          ? `${formValues.uploadedAt}:00`
          : formValues.uploadedAt
        : null,
         documentTypeId: formValues.documentTypeId ? Number(formValues.documentTypeId) : null,
          applicationId: formValues.applicationId ? Number(formValues.applicationId) : null,
    };

    if (props.operationType === "insert") {
      await handleInsert(payload);
    } else if (props.operationType === "edit") {
      await handleUpdate({
        id: Number(formValues.id),
        ...payload,
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <TextInput
              label="File Name"
              name="fileName"
              value={formValues.fileName || ""}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="File Path"
              name="filePath"
              value={formValues.filePath || ""}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Mime Type"
              name="mimeType"
              value={formValues.mimeType || ""}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="File Size Bytes"
              name="fileSizeBytes"
              type="number"
              value={formValues.fileSizeBytes || ""}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

         
          <Grid size={{ xs: 12 }}>
  <Autocomplete
    options={props.dropDownLists?.uploadedBy || []}
    value={getSelectedOption(
      props.dropDownLists?.uploadedBy || [],
      formValues.uploadedBy
    )}
    getOptionLabel={(option) => getOptionName(option)}
    isOptionEqualToValue={(option, value) =>
      Number(getOptionId(option)) === Number(getOptionId(value))
    }
    onChange={(event, value) =>
      handleDropdownChange("uploadedBy", value)
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Uploaded By"
        error={Boolean(errors?.uploadedBy)}
        helperText={errors?.uploadedBy}
      />
    )}
  />
</Grid>
 <Grid size={{ xs: 12 }}>
  <Autocomplete
    options={props.dropDownLists?.applicationId || []}
    value={getSelectedOption(
      props.dropDownLists?.applicationId || [],
      formValues.applicationId
    )}
    getOptionLabel={(option) => getOptionName(option)}
    isOptionEqualToValue={(option, value) =>
      Number(getOptionId(option)) === Number(getOptionId(value))
    }
    onChange={(event, value) =>
      handleDropdownChange("applicationId", value)
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Application Id"
        error={Boolean(errors?.applicationId)}
        helperText={errors?.applicationId}
      />
    )}
  />
</Grid>
<Grid size={{ xs: 12 }}>
  <Autocomplete
    options={props.dropDownLists?.documentTypeId || []}
    value={getSelectedOption(
      props.dropDownLists?.documentTypeId || [],
      formValues.documentTypeId
    )}
    getOptionLabel={(option) => getOptionName(option)}
    isOptionEqualToValue={(option, value) =>
      Number(getOptionId(option)) === Number(getOptionId(value))
    }
    onChange={(event, value) =>
      handleDropdownChange("documentTypeId", value)
    }
    renderInput={(params) => (
      <TextField
        {...params}
        label="Document Type"
        error={Boolean(errors?.documentTypeId)}
        helperText={errors?.documentTypeId}
      />
    )}
  />
</Grid>
          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Uploaded At"
              name="uploadedAt"
              type="datetime-local"
              value={formValues.uploadedAt || ""}
              onChange={handleChangeFormValues}
              errors={errors}
              InputLabelProps={{ shrink: true }}
              required
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
    dropDownLists: PropTypes.object,
  handleCloseFormModal: PropTypes.func,
  handleRefreshTable: PropTypes.func,
  operationType: PropTypes.string,
  rowID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  canSave: PropTypes.bool,
  userDropdown: PropTypes.array,
};

export default Form;