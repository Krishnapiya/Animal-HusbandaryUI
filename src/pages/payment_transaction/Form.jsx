import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import TextInput from "../../components/FormComponents/TextInput";
import FormButtons from "../../components/FormComponents/FormButtons";
import useForm from "../../hooks/useForm";

const Form = (props) => {
  const formFields = {
    id: "",
    transactionRef: "",
    applicationId: "",
    paymentPurpose: "REGISTRATION",
    amount: "",
    currency: "INR",
    statusId: "",
    gatewayName: "",
    gatewayOrderId: "",
    gatewayPaymentId: "",
    gatewayResponse: "",
    receiptNumber: "",
    paymentDate: "",
    payerUserId: "",
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
    option?.name ||
    option?.label ||
    option?.applicationNumber ||
    option?.statusName ||
    option?.username ||
    option?.fname ||
    "";

  const getSelectedOption = (list, value) => {
    return (
      list?.find((item) => Number(getOptionId(item)) === Number(value)) || null
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

  const formatDateTime = (value) => {
    if (!value) return null;

    if (value.includes("T")) {
      return value.length === 16 ? `${value}:00` : value;
    }

    if (value.includes("/")) {
      const [day, month, year] = value.split("/");
      return `${year}-${month}-${day}T00:00:00`;
    }

    return `${value}T00:00:00`;
  };

  const getGatewayResponseText = () => {
    if (!formValues.gatewayResponse) return "";

    if (typeof formValues.gatewayResponse === "object") {
      return formValues.gatewayResponse.response || "";
    }

    return formValues.gatewayResponse;
  };

  const handleGatewayResponseChange = (event) => {
    handleChangeFormValues({
      target: {
        name: "gatewayResponse",
        value: event.target.value,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const gatewayResponseText = getGatewayResponseText();

    const payload = {
      transactionRef: formValues.transactionRef,

      applicationId: formValues.applicationId
        ? Number(formValues.applicationId)
        : null,

      // DB allows only REGISTRATION because check constraint exists
      paymentPurpose: "REGISTRATION",

      // BigDecimal backend can accept string value
      amount: formValues.amount || null,

      // DB length is varchar(3)
      currency: formValues.currency
        ? formValues.currency.toUpperCase().slice(0, 3)
        : "INR",

      statusId: formValues.statusId ? Number(formValues.statusId) : null,

      gatewayName: formValues.gatewayName || null,
      gatewayOrderId: formValues.gatewayOrderId || null,
      gatewayPaymentId: formValues.gatewayPaymentId || null,

      // DB is jsonb, so text is wrapped as JSON object
      gatewayResponse: gatewayResponseText
        ? {
            response: gatewayResponseText,
          }
        : null,

      receiptNumber: formValues.receiptNumber || null,
      paymentDate: formatDateTime(formValues.paymentDate),

      payerUserId: formValues.payerUserId
        ? Number(formValues.payerUserId)
        : null,
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
              label="Transaction Ref"
              name="transactionRef"
              value={formValues.transactionRef || ""}
              onChange={handleChangeFormValues}
              errors={errors}
              required
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
                  label="Application"
                  error={Boolean(errors?.applicationId)}
                  helperText={errors?.applicationId}
                  required
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Payment Purpose"
              name="paymentPurpose"
              value="REGISTRATION"
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Amount"
              name="amount"
              type="number"
              value={formValues.amount || ""}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Currency"
              name="currency"
              value={formValues.currency || ""}
              onChange={handleChangeFormValues}
              errors={errors}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Autocomplete
              options={props.dropDownLists?.statusId || []}
              value={getSelectedOption(
                props.dropDownLists?.statusId || [],
                formValues.statusId
              )}
              getOptionLabel={(option) => getOptionName(option)}
              isOptionEqualToValue={(option, value) =>
                Number(getOptionId(option)) === Number(getOptionId(value))
              }
              onChange={(event, value) =>
                handleDropdownChange("statusId", value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Status"
                  error={Boolean(errors?.statusId)}
                  helperText={errors?.statusId}
                  required
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Gateway Name"
              name="gatewayName"
              value={formValues.gatewayName || ""}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Gateway Order ID"
              name="gatewayOrderId"
              value={formValues.gatewayOrderId || ""}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Gateway Payment ID"
              name="gatewayPaymentId"
              value={formValues.gatewayPaymentId || ""}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Gateway Response"
              name="gatewayResponse"
              value={getGatewayResponseText()}
              onChange={handleGatewayResponseChange}
              error={Boolean(errors?.gatewayResponse)}
              helperText={errors?.gatewayResponse}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Receipt Number"
              name="receiptNumber"
              value={formValues.receiptNumber || ""}
              onChange={handleChangeFormValues}
              errors={errors}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextInput
              label="Payment Date"
              name="paymentDate"
              type="datetime-local"
              value={
                formValues.paymentDate
                  ? String(formValues.paymentDate).slice(0, 16)
                  : ""
              }
              onChange={handleChangeFormValues}
              errors={errors}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Autocomplete
              options={props.dropDownLists?.payerUserId || []}
              value={getSelectedOption(
                props.dropDownLists?.payerUserId || [],
                formValues.payerUserId
              )}
              getOptionLabel={(option) => getOptionName(option)}
              isOptionEqualToValue={(option, value) =>
                Number(getOptionId(option)) === Number(getOptionId(value))
              }
              onChange={(event, value) =>
                handleDropdownChange("payerUserId", value)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payer User"
                  error={Boolean(errors?.payerUserId)}
                  helperText={errors?.payerUserId}
                />
              )}
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
  dropDownLists: PropTypes.any,
};

export default Form;