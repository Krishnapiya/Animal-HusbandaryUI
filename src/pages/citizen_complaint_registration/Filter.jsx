import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import TextInput from "../../components/FormComponents/TextInput";

const Filter = ({ filterFetchParams, setFilterFetchParams }) => {
  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Complaint Number"
          name="complaintNumber"
          value={filterFetchParams?.complaintNumber || ""}
          onChange={(e) =>
            setFilterFetchParams((prev) => ({
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
  filterFetchParams: PropTypes.object,
  setFilterFetchParams: PropTypes.func,
};

export default Filter;