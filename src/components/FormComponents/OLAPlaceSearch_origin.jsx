import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { debounce } from "@mui/material/utils";
const extractDataFromAPIResponse = (jsonData) => {
  const extractedData = jsonData.predictions.map((prediction) => ({
    description: prediction.description,
    geometry: prediction.geometry,
    main_text: prediction.structured_formatting.main_text,
    secondary_text: prediction.structured_formatting.secondary_text,
  }));

  return extractedData;
};
const OLAPlaceSearch = (props) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.olamaps.io/places/v1/autocomplete",
        {
          params: {
            input: query,
            api_key: "XOf3EtyotDiHbSecy935bgaFcUIgYYNzQYtS6Gia",
          },
        },
      );
      setOptions(extractDataFromAPIResponse(response.data));
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchOptions = useMemo(() => debounce(fetchOptions, 600), []);

  useEffect(() => {
    if (inputValue === "") {
      setOptions([]);
      return;
    }
    debouncedFetchOptions(inputValue);
  }, [inputValue, debouncedFetchOptions]);
  const onChangePlace = (_, value) => {
    if (value) {
      props.handleChangeLocation(
        value.geometry.location.lng,
        value.geometry.location.lat,
      );
    }
  };
  return (
    <Autocomplete
      fullWidth
      disablePortal={props.disablePortal && true}
      size="small"
      options={options}
      // getOptionLabel={(option) => option.label}
      getOptionLabel={(option) => option.main_text}
      loading={loading}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          setInputValue(newInputValue);
        }
      }}
      onChange={onChangePlace}
      renderOption={(props, option) => (
        <li {...props}>
          <Box>
            <Typography variant="subtitle1">{option.main_text}</Typography>
            <Typography variant="body2" color="textSecondary">
              {option.secondary_text}
            </Typography>
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            ".MuiAutocomplete-popupIndicator": {
              display: "none",
            },
          }}
          label="Search Places.."
          variant="outlined"
          color="success"
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

OLAPlaceSearch.propTypes = {
  disablePortal: PropTypes.bool,
  handleChangeLocation: PropTypes.func,
};

export default OLAPlaceSearch;
