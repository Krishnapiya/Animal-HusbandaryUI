import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
const DateTimeFilterInput = (props) => {
  const handleChange = (e) => {
    //setValue(val);
    props.setFilterFetchParams({
      ...props.filterFetchParams,
      [props.param]: e.target.value,
    });
  };
  return (
    <TextField
      id="outlined-basic"
      type="datetime-local"
      label={props.label}
      slotProps={{ inputLabel: { shrink: true } }}
      name={props.param}
      value={props.filterFetchParams["props.param"]}
      variant="outlined"
      onChange={handleChange}
      fullWidth
      size="small"
    />
  );
};

DateTimeFilterInput.propTypes = {
  filterFetchParams: PropTypes.object,
  label: PropTypes.string,
  param: PropTypes.string,
  setFilterFetchParams: PropTypes.func,
};

export default DateTimeFilterInput;
