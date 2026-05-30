import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Checkbox from "@mui/material/Checkbox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MultipleDropDown = (props) => {
  const handleChange = (_, val) => {
    props.setFilterFetchParams({
      ...props.filterFetchParams,
      [props.param]: val.map((item) => item.id),
    });
  };

  return (
    <Autocomplete
      disablePortal={props.disablePortal && true}
      multiple
      disableCloseOnSelect
      limitTags={2}
      size="small"
      id="device"
      /*eslint-disable*/
      value={
        props.filterFetchParams[props.param]
          ? props.list.filter((item) =>
              props.filterFetchParams[props.param].includes(item.id),
            )
          : []
      }
      /*eslint-disable*/
      fullWidth
      options={props.list || []}
      getOptionLabel={(option) => option.name || ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={handleChange}
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
        <TextField {...params} label={props.label} fullWidth />
      )}
    />
  );
};

MultipleDropDown.propTypes = {
  disablePortal: PropTypes.bool,
  filterFetchParams: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  param: PropTypes.string.isRequired,
  setFilterFetchParams: PropTypes.func.isRequired,
};

export default MultipleDropDown;
