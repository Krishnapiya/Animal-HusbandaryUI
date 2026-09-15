import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  return (
    <>
      <Grid item size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Complaint Number"
          name="complaintNumber"
          value={props.filterFetchParams.complaintNumber || ""}
          onChange={(e) =>
            props.setFilterFetchParams((prev) => ({
              ...prev,
              complaintNumber: e.target.value,
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