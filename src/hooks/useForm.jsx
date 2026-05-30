import { useState, useEffect } from "react";
import { toast } from "material-react-toastify";
import { addItem, editSingleItem, getItemByID } from "../api-client/apiCall";
const useForm = (
  initialValues,
  partialFields,
  api_url,
  alertString,
  handleCloseFormModal,
  handleRefreshTable,
  rowID,
  operationType
) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const handleChangeFormValues = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value
    });
  };

  const handleChangeFiles = (value, name) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  const handleDeleteFiles = (name) => {
    setFormValues({
      ...formValues,
      [name]: null
    });
  };
  const handleChangeDropDown = (_, value, name) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  const handleChangeMultiDropDown = (_, value, name) => {
    setFormValues({
      ...formValues,
      [name]: value || []
    });
  };

  const handleChangeMultiSelectList = (ids, name) => {
    setFormValues({
      ...formValues,
      [name]: ids
    });
  };

  const handleChangeValueByName = (name, value) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  const handleSwitchChange = (event, value) => {
    setFormValues({
      ...formValues,
      [event.target.name]: value
    });
  };
  const handleChangeLocation = (lon, lat) => {
    setFormValues({
      ...formValues,
      latitude: lat,
      longitude: lon
    });
  };
  const handleClear = () => {
    setFormValues(initialValues);
    setErrors({});
  };
  const handlePartialClear = () => {
    setFormValues({
      ...formValues,
      ...partialFields
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
  const handleInsert = async (formData, includeToken) => {
    setErrors({});
    setIsSubmitting(true);
    setResponseData(null);
    const data = { payLoad: formData };
    const response = await addItem(`${api_url}save`, data, includeToken);
    if (response.isSuccess) {
      setResponseData({ data: response.data, operation: "add" });
      toast.success(alertString + " Added Successfully");
      handleCloseFormModal();
      handleRefreshTable();
    } else {
      setErrorMessages(response.data);
      if (response.data.detail) toast.error(response.data.detail);
      else if (response.data.non_field_errors)
        toast.error(response.data.non_field_errors[0]);
      else if (response.status == 400)
        toast.error("Please Check all the fields");
      else toast.error("Some Thing Went Wrong");
    }
    setIsSubmitting(false);
  };
  const handleInsertAnother = async (formData, includeToken) => {
    setErrors({});
    setIsSubmitting(true);
    setResponseData(null);
    const response = await addItem(api_url, formData, includeToken);
    if (response.isSuccess) {
      setResponseData({ data: response.data, operation: "add" });
      toast.success(alertString + " Added Successfully");
      handlePartialClear();
      handleRefreshTable();
    } else {
      setErrorMessages(response.data);
      if (response.data.detail) toast.error(response.data.detail);
      else if (response.data.non_field_errors)
        toast.error(response.data.non_field_errors[0]);
      else if (response.status == 400)
        toast.error("Please Check all the fields");
      else toast.error("Some Thing Went Wrong");
    }
    setIsSubmitting(false);
  };
  const handleUpdate = async (formData) => {
    setErrors({});
    setIsSubmitting(true);
    setResponseData(null);
    const data={payLoad:formData}
    const response = await editSingleItem(`${api_url}save`, data);
    if (response.isSuccess) {
      setResponseData({ data: response.data, operation: "edit" });
      toast.success(alertString + " Updated Sucessfully");
      handleCloseFormModal();
      handleRefreshTable();
    } else {
      setErrorMessages(response.data);
      if (response.data.detail) toast.error(response.data.detail);
      else if (response.data.non_field_errors)
        toast.error(response.data.non_field_errors[0]);
      else if (response.status == 400)
        toast.error("Please Check all the fields");
      else toast.error("Some Thing Went Wrong");
    }
    setIsSubmitting(false);
  };
  useEffect(() => {
    console.log("ROWIDDDD---->", rowID, operationType);
    if (rowID !== "") {
      // setRowID("");
      if (operationType === "edit") {
        (async () => {
          const response = await getItemByID(`${api_url}list/all`, {id:rowID});
          if (response.isSuccess) {
            const p = response.data?.payLoad ?? response.data?.payload;
            if (p?.totalRecords === 1) {
              handlePopulateData(p.content[0]);
            } else {
              toast.warning("No Data Found");
            }
          } else {
            handleClear();
            handleCloseFormModal();
            toast.error("You cant perform this operation");
          }
        })();
      }
    }
  }, [rowID]);
  return {
    formValues,
    setFormValues,
    errors,
    setErrorMessages,
    isSubmitting,
    responseData,
    handleChangeFormValues,
    handleChangeValueByName,
    handleChangeFiles,
    handleDeleteFiles,
    handleChangeDropDown,
    handleChangeMultiDropDown,
    handleChangeMultiSelectList,
    handleSwitchChange,
    handleChangeLocation,
    handlePopulateData,
    handleClear,
    handlePartialClear,
    handleInsert,
    handleInsertAnother,
    handleUpdate
  };
};

export default useForm;
