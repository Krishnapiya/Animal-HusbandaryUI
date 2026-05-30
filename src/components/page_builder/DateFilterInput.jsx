import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
const DateFilterInput = (props) => {
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
      type="date"
      label={props.label}
      InputLabelProps={{ shrink: true }}
      name={props.param}
      value={props.filterFetchParams["props.param"]}
      variant="outlined"
      onChange={handleChange}
      fullWidth
      size="small"
    />
  );
};

DateFilterInput.propTypes = {
  filterFetchParams: PropTypes.object,
  label: PropTypes.string,
  param: PropTypes.string,
  setFilterFetchParams: PropTypes.func,
};

export default DateFilterInput;
