import { useState, useEffect } from "react";
import { toast } from "material-react-toastify";
import { addItem, editItem, getItem } from "../api-client/apiCall";
const useTreeForm = (
  initialValues,
  partialFields,
  api_url,
  alertString,
  handleCloseFormModal,
  handleRefreshTree,
  rowID,
  operationType,
  handleAfterSuccessInsert,
) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChangeFormValues = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangeFiles = (value, name) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleDeleteFiles = (name) => {
    setFormValues({
      ...formValues,
      [name]: null,
    });
  };
  const handleChangeDropDown = (_, value, name) => {
    const id = value ? value.id : "";
    setFormValues({
      ...formValues,
      [name]: id,
    });
  };
  const handleChangeMultiDropDown = (_, value, name) => {
    const ids = value ? value.map((item) => item.id) : [];
    setFormValues({
      ...formValues,
      [name]: ids,
    });
  };
  const handleChangeValueByName = (name, value) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleSwitchChange = (event, value) => {
    setFormValues({
      ...formValues,
      [event.target.name]: value,
    });
  };
  const handleChangeLocation = (lon, lat) => {
    setFormValues({
      ...formValues,
      latitude: lat,
      longitude: lon,
    });
  };
  const handleClear = () => {
    setFormValues(initialValues);
    setErrors(initialValues);
  };
  const handlePartialClear = () => {
    setFormValues({
      ...formValues,
      ...partialFields,
    });
    // setErrors(initialValues);
  };
  const handlePopulateData = (data) => {
    setFormValues(data);
  };
  const setErrorMessages = (error_data) => {
    const errors = {};
    Object.keys(error_data).forEach((key) => {
      errors[key] = error_data[key][0];
    });
    setErrors(errors);
  };
  const handleInsert = async (formData) => {
    setErrors({});
    setIsSubmitting(true);
    const response = await addItem(api_url, formData);
    if (response.isSuccess) {
      toast.success(alertString + " Added Sucessfully");
      handleCloseFormModal();
      handleRefreshTree();
      handleAfterSuccessInsert(response.data.id);
    } else {
      setErrorMessages(response.data);
      if (response.data.detail) toast.error(response.data.detail);
      else if (response.data.non_field_errors)
        toast.error(response.data.non_field_errors[0]);
      else toast.error("Some Thing Went Wrong");
    }
    setIsSubmitting(false);
  };
  const handleInsertAnother = async (formData) => {
    setErrors({});
    setIsSubmitting(true);
    const response = await addItem(api_url, formData);
    if (response.isSuccess) {
      toast.success(alertString + " Added Sucessfully");
      handlePartialClear();
      handleRefreshTree();
    } else {
      setErrorMessages(response.data);
      if (response.data.detail) toast.error(response.data.detail);
      else if (response.data.non_field_errors)
        toast.error(response.data.non_field_errors[0]);
      else toast.error("Some Thing Went Wrong");
    }
    setIsSubmitting(false);
  };
  const handleUpdate = async (formData, id) => {
    setErrors({});
    setIsSubmitting(true);
    const response = await editItem(api_url, id, formData);
    if (response.isSuccess) {
      toast.success(alertString + " Updated Sucessfully");
      handleCloseFormModal();
      handleRefreshTree();
    } else {
      setErrorMessages(response.data);
      if (response.data.detail) toast.error(response.data.detail);
      else if (response.data.non_field_errors)
        toast.error(response.data.non_field_errors[0]);
      else toast.error("Some Thing Went Wrong");
    }
    setIsSubmitting(false);
  };
  useEffect(() => {
    if (rowID !== "") {
      // setRowID("");
      if (operationType === "edit") {
        (async () => {
          const response = await getItem(api_url, rowID);
          if (response.isSuccess) {
            handlePopulateData(response.data);
          } else {
            handleClear();
            handleCloseFormModal();
            toast.error("You cant perform this operation");
          }
        })();
      }
    }
  }, [rowID, operationType]);
  return {
    formValues,
    setFormValues,
    errors,
    setErrorMessages,
    isSubmitting,
    handleChangeFormValues,
    handleChangeValueByName,
    handleChangeFiles,
    handleDeleteFiles,
    handleChangeDropDown,
    handleChangeMultiDropDown,
    handleSwitchChange,
    handleChangeLocation,
    handlePopulateData,
    handleClear,
    handlePartialClear,
    handleInsert,
    handleInsertAnother,
    handleUpdate,
  };
};

export default useTreeForm;
