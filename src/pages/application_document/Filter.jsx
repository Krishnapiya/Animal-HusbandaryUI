import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import TextInput from "../../components/FormComponents/TextInput";

const Filter = (props) => {
  const { filterFetchParams, setFilterFetchParams, dropDownLists = {} } = props;

  console.log("filterFetchParams", filterFetchParams);

  const handleChange = (name, value) => {
    setFilterFetchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getOptionId = (option) => option?.id ?? option?.value ?? "";

  const getOptionName = (option) =>
    option?.name ||
    option?.label ||
    option?.applicationNumber ||
    option?.documentTypeName ||
    option?.username ||
    "";

  const getSelectedOption = (list, value) => {
    return (
      list?.find((item) => Number(getOptionId(item)) === Number(value)) || null
    );
  };

  return (
    <>
      {/* Uploaded By */}
      <Grid item size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={dropDownLists["uploadedBy"] || []}
          value={getSelectedOption(
            dropDownLists["uploadedBy"] || [],
            filterFetchParams.uploadedBy
          )}
          getOptionLabel={(option) => getOptionName(option)}
          isOptionEqualToValue={(option, value) =>
            Number(getOptionId(option)) === Number(getOptionId(value))
          }
          onChange={(event, value) =>
            handleChange("uploadedBy", value ? getOptionId(value) : "")
          }
          renderInput={(params) => (
            <TextField {...params} label="Uploaded By" />
          )}
        />
      </Grid>

      {/* Uploaded Date From */}
      <Grid item size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Uploaded Date From"
          name="uploadedAtFrom"
          type="date"
          value={filterFetchParams.uploadedAtFrom || ""}
          onChange={(e) => handleChange("uploadedAtFrom", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      {/* Uploaded Date To */}
      <Grid item size={{ xs: 12, sm: 6 }}>
        <TextInput
          label="Uploaded Date To"
          name="uploadedAtTo"
          type="date"
          value={filterFetchParams.uploadedAtTo || ""}
          onChange={(e) => handleChange("uploadedAtTo", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      {/* Application Number */}
      <Grid item size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={dropDownLists["applicationId"] || []}
          value={getSelectedOption(
            dropDownLists["applicationId"] || [],
            filterFetchParams.applicationId
          )}
          getOptionLabel={(option) => getOptionName(option)}
          isOptionEqualToValue={(option, value) =>
            Number(getOptionId(option)) === Number(getOptionId(value))
          }
          onChange={(event, value) =>
            handleChange("applicationId", value ? getOptionId(value) : "")
          }
          renderInput={(params) => (
            <TextField {...params} label="Application Number" />
          )}
        />
      </Grid>

      {/* Document Type */}
      <Grid item size={{ xs: 12, sm: 6 }}>
        <Autocomplete
          options={dropDownLists["documentTypeId"] || []}
          value={getSelectedOption(
            dropDownLists["documentTypeId"] || [],
            filterFetchParams.documentTypeId
          )}
          getOptionLabel={(option) => getOptionName(option)}
          isOptionEqualToValue={(option, value) =>
            Number(getOptionId(option)) === Number(getOptionId(value))
          }
          onChange={(event, value) =>
            handleChange("documentTypeId", value ? getOptionId(value) : "")
          }
          renderInput={(params) => (
            <TextField {...params} label="Document Type" />
          )}
        />
      </Grid>
    </>
  );
};

Filter.propTypes = {
  dropDownLists: PropTypes.any,
  filterFetchParams: PropTypes.any,
  setFilterFetchParams: PropTypes.func,
};

export default Filter;