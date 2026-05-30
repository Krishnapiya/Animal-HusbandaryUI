import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
const TimeInput = (props) => {
  return (
    <TextField
      id="outlined-basic"
      type="time"
      label={props.label}
      slotProps={{ inputLabel: { shrink: true } }}
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

TimeInput.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
};

export default TimeInput;
