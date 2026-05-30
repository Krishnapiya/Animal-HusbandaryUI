import { useState } from "react";
import { toast } from "material-react-toastify";
import { changePassword } from "../api-client/accounts";

const useChangePassword = (formFields) => {
  const [formValues, setFormValues] = useState(formFields);
  const [errors, setErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChangeFormValues = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    setErrors({});
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    for (var key in formFields) {
      if (key === "profile_picture" && typeof formValues[key] === "string") {
        continue;
      }
      if (formValues[key] === "" || formValues[key] === null) {
        formData.append(key, "");
      } else formData.append(key, formValues[key]);
    }
    const response = await changePassword(formData);
    if (response.isSuccess) {
      toast.success("Password Updated Sucessfully");
      setIsSuccess(true);
      // props.handleCloseFormModal();
      // props.handleRefreshTable();
    } else {
      setIsSuccess(false);
    }
    if (!response.isSuccess) {
      setErrors(response.data);
      if (response.data.detail) toast.error(response.data.detail);
      else toast.error("Some Thing Went Wrong");
    }
    setIsSubmitting(false);
  };

  return {
    formValues,
    setFormValues,
    errors,
    isSubmitting,
    isSuccess,
    handleChangeFormValues,
    handleSubmit,
  };
};

export default useChangePassword;
