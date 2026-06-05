import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <Grid item size={{ xs: 12, sm: 6 }}>
      <TextInput
        label="Role name"
        name="roleName"
        value={props.filterFetchParams.roleName || ""}
        onChange={(e) =>
          props.setFilterFetchParams((prev) => ({
            ...prev,
            roleName: e.target.value,
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
