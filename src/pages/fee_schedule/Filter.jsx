import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <>
      <Grid item size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Entity Type"
          name="entityType"
          value={props.filterFetchParams.entityType || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              entityType: e.target.value,
            }))
          }
        />
      </Grid>

      <Grid item size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Fee Kind"
          name="feeKind"
          value={props.filterFetchParams.feeKind || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              feeKind: e.target.value,
            }))
          }
        />
      </Grid>
    </>
  );
};

Filter.propTypes = {
  filterFetchParams: PropTypes.any,
  setFilterFetchParams: PropTypes.func,
};

export default Filter;