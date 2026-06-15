import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
const TextInput = (props) => {
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
      error={Boolean(props.errors && props.errors[props.name]).valueOf()}
      helperText={props.errors && props.errors[props.name]}
      required={props.required}
    />
  );
};

TextInput.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string,
};

export default TextInput;
