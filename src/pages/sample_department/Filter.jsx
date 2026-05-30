import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <Grid item size={{ xs: 12, sm: 6 }}>
      <TextInput
        label="Department name"
        name="name"
        value={props.filterFetchParams.name || ""}
        onChange={(e) =>
          props.setFilterFetchParams((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />
    </Grid>
  );
};

Filter.propTypes = {
  filterFetchParams: PropTypes.any,
  setFilterFetchParams: PropTypes.func,
};

export default Filter;

