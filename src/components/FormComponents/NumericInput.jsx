import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
const NumericInput = (props) => {
  return (
    <TextField
      id="outlined-basic"
      label={props.label}
      name={props.name}
      disabled={props.disabled}
      value={parseFloat(props.value)}
      variant="outlined"
      onChange={props.onChange}
      fullWidth
      size="small"
      type="number"
      InputProps={{ inputProps: { min: props.min, max: props.max } }}
      error={Boolean(props.errors && props.errors[props.name]).valueOf()}
      helperText={props.errors && props.errors[props.name]}
      required={props.required}
    />
  );
};

NumericInput.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.number,
};

export default NumericInput;
