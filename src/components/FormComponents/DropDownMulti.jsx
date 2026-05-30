import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Checkbox from "@mui/material/Checkbox";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const DropDownMulti = (props) => {
  return (
    <>
      <Autocomplete
        disablePortal={props.disablePortal && true}
        multiple
        disableCloseOnSelect
        variant="standard"
        limitTags={2}
        size="small"
        id="device"
        name={props.name}
        value={props.formValues[props.name]}
        options={props.list || []}
        getOptionLabel={(option) => (option.name ? option.name.toString() : "")}
        getOptionValue={(option) => option.id}
        onChange={(e, v) => {
          props.onChange(e, v, props.name);
        }}
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
            error={Boolean(
              props.errors &&
                props.errors[props.name] &&
                typeof props.errors[props.name] != "object"
            ).valueOf()}
            helperText={props.errors && props.errors[props.name]}
          />
        )}
      />
    </>
  );
};

DropDownMulti.propTypes = {
  disablePortal: PropTypes.bool,
  errors: PropTypes.object,
  formValues: PropTypes.object,
  label: PropTypes.string,
  list: PropTypes.array,
  name: PropTypes.string,
  onChange: PropTypes.func
};

export default DropDownMulti;
