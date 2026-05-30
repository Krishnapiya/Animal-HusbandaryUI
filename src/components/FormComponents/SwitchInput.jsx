import PropTypes from "prop-types";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
const SwitchInput = (props) => {
  return (
    <FormControl
      error={Boolean(props.errors && props.errors[props.name]).valueOf()}
    >
      <FormControlLabel
        control={<Switch sx={{ marginLeft: 2 }} />}
        label={props.label}
        name={props.name}
        checked={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
      />
      {props.errors && (
        <FormHelperText>{props.errors[props.name]}</FormHelperText>
      )}
    </FormControl>
  );
};

SwitchInput.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.any,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default SwitchInput;
