import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
const TextInput = (props) => {
  const isError =
    props.error !== undefined
      ? Boolean(props.error)
      : Boolean(props.errors && props.name && props.errors[props.name]).valueOf();

  const helperText =
    props.helperText !== undefined
      ? props.helperText
      : props.errors && props.name
      ? props.errors[props.name]
      : undefined;

  return (
    <TextField
      id="outlined-basic"
      label={props.label}
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      type={props.type || "text"}
      variant="outlined"
      onChange={props.onChange}
      fullWidth
      size="small"
      error={isError}
      helperText={helperText}
      required={props.required}
      slotProps={props.slotProps}
      InputLabelProps={props.InputLabelProps}
      inputProps={props.inputProps}
    />
  );
};

TextInput.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  errors: PropTypes.object,
  helperText: PropTypes.node,
  InputLabelProps: PropTypes.object,
  inputProps: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  slotProps: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TextInput;
