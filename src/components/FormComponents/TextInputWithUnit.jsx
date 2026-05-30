import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const TextInputWithUnit = (props) => {
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
      size="small"
      error={Boolean(props.errors && props.errors[props.name]).valueOf()}
      helperText={props.errors && props.errors[props.name]}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">{props.unit}</InputAdornment>
          ),
        },
      }}
    />
  );
};

TextInputWithUnit.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  unit: PropTypes.string,
  value: PropTypes.string,
};

export default TextInputWithUnit;
