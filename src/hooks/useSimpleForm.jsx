import { useState } from "react";
import { toast } from "material-react-toastify";
const useSimpleForm = (initialValues, onSubmit) => {
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
  const handleSubmit = async (event) => {
    setErrors({});
    event.preventDefault();
    setIsSubmitting(true);
    const response = await onSubmit();
    if (!response.isSuccess) {
      setErrorMessages(response.data);
      console.log(response.status);
      if (response.status === 400) toast.error("Please Check All Fields !!!");
      if (response.data.detail) toast.error(response.data.detail);
      else toast.error("Some Thing Went Wrong");
    }
    setIsSubmitting(false);
  };

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
    handleSubmit,
  };
};

export default useSimpleForm;
