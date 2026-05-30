import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { debounce } from "@mui/material/utils";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
export const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

const SearchableDropDown = ({ disablePortal, dropdownURL, label }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (query) => {
    setLoading(true);
    try {
      const config = {
        method: "GET",
        baseURL: BASE_API_URL,
        url: dropdownURL,
        params: {
          search: query
        }
        //headers: getHeader(),
      };
      const response = await axios(config);
      console.log(response);
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchOptions = useMemo(() => debounce(fetchOptions, 300), []);

  useEffect(() => {
    if (inputValue === "") {
      setOptions([]);
      return;
    }
    debouncedFetchOptions(inputValue);
  }, [inputValue, debouncedFetchOptions]);
  const onChangeValue = (_, value) => {
    console.log(value);
  };
  return (
    <Autocomplete
      disablePortal={disablePortal && true}
      size="small"
      options={options}
      // getOptionLabel={(option) => option.label}
      getOptionLabel={(option) => {
        return `${option.name}`;
      }}
      loading={loading}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          setInputValue(newInputValue);
        }
      }}
      onChange={onChangeValue}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            ".MuiAutocomplete-popupIndicator": {
              display: "none"
            }
          }}
          label={`Search by ${label}`}
          variant="outlined"
          // InputProps={{
          //   ...params.InputProps,
          //   endAdornment: (
          //     <>
          //       {loading ? (
          //         <CircularProgress color="inherit" size={20} />
          //       ) : null}
          //       {params.InputProps.endAdornment}
          //     </>
          //   )
          // }}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps?.endAdornment}
                </>
              )
            }
          }}
        />
      )}
    />
  );
};

SearchableDropDown.propTypes = {
  disablePortal: PropTypes.bool,
  dropdownURL: PropTypes.string,
  label: PropTypes.string
};

export default SearchableDropDown;
