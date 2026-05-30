import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
const PasswordInput = (props) => {
  return (
    <TextField
      id="outlined-basic"
      type="password"
      label={props.label}
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      variant="outlined"
      onChange={props.onChange}
      fullWidth
      size="small"
      error={Boolean(props.errors && props.errors[props.name]).valueOf()}
      helperText={props.errors && props.errors[props.name]}
    />
  );
};

PasswordInput.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default PasswordInput;
