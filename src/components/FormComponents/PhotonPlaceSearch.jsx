import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { debounce } from "@mui/material/utils";

const PhotonPlaceSearch = (props) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get("https://photon.komoot.io/api/", {
        params: {
          q: query,
          bbox: "74.60,7.96,77.41,13.05",
          limit: 20,
        },
      });
      setOptions(response.data.features);
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
  const onChangePlace = (_, value) => {
    const lonLat = value.geometry.coordinates;
    props.handleChangeLocation(lonLat[0], lonLat[1]);
  };
  return (
    <Autocomplete
      disablePortal={props.disablePortal && true}
      size="small"
      options={options}
      // getOptionLabel={(option) => option.label}
      getOptionLabel={(option) => {
        return `${option.properties.name} - ${option.properties.county} - ${option.properties.state}`;
      }}
      loading={loading}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          setInputValue(newInputValue);
        }
      }}
      onChange={onChangePlace}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            ".MuiAutocomplete-popupIndicator": {
              display: "none",
            },
          }}
          label="Search Location by Name"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

PhotonPlaceSearch.propTypes = {
  disablePortal: PropTypes.bool,
  handleChangeLocation: PropTypes.func,
};

export default PhotonPlaceSearch;
