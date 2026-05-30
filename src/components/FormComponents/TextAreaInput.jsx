import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

const TextAreaInput = (props) => {
  return (
    <TextField
      id="outlined-basic"
      label={props.label}
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      variant="outlined"
      onChange={props.onChange}
      fullWidth
      multiline
      minRows={3}
      size="small"
      error={Boolean(props.errors && props.errors[props.name]).valueOf()}
      helperText={props.errors && props.errors[props.name]}
    />
  );
};

TextAreaInput.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default TextAreaInput;
