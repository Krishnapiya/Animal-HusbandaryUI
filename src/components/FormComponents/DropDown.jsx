/*eslint-disable*/
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import RadioButtonCheckedRounded from "@mui/icons-material/RadioButtonCheckedRounded";
import Checkbox from "@mui/material/Checkbox";
const icon = <RadioButtonUncheckedRounded fontSize="small" />;
const checkedIcon = <RadioButtonCheckedRounded fontSize="small" />;
const DropDown = (props) => {
  return (
    <>
      <Autocomplete
        disablePortal={props.disablePortal && true}
        readOnly={props.readOnly}
        fullWidth
        variant="standard"
        size="small"
        id="device"
        name={props.name}
        value={props.formValues[props.name]}
        options={props.list || []}
        getOptionLabel={(option) => (option?.name != null ? String(option.name) : "")}
        isOptionEqualToValue={(a, b) => {
          if (a == null && b == null) return true;
          if (a == null || b == null) return false;
          return String(a.id) === String(b.id);
        }}
        onChange={(e, v) => {
          props.onChange(e, v, props.name);
        }}
        disabled={props.disabled}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.id}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            placeholder={`Select ${props.label}`}
            error={Boolean(props.errors && props.errors[props.name]).valueOf()}
            helperText={props.errors && props.errors[props.name]}
          />
        )}
      />
    </>
  );
};

DropDown.propTypes = {
  disablePortal: PropTypes.bool,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  formValues: PropTypes.object,
  label: PropTypes.string,
  list: PropTypes.array,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool
};

export default DropDown;
