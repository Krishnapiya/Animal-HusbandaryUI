import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { debounce } from "@mui/material/utils";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import buffer_map_icon from "../../components/maps/icons/location_search.svg";
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
      let location_search_lyr = new VectorLayer({
        title: "Location Search",
        layer_category: "location_search_layer",
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point(
                fromLonLat([
                  value.geometry.location.lng,
                  value.geometry.location.lat,
                ]),
              ),
              description: value?.description,
            }),
          ],
        }),
        style: new Style({
          image: new Icon({
            opacity: 1,
            src: buffer_map_icon,
          }),
        }),
      });
      props.handleChangeLocation(location_search_lyr);
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
        <li {...props} key={option.id}>
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
          //label="Search Places.."
          placeholder="Search Places.."
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
            sx: {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#064210", // Border color when focused
              },
              "&:focus .MuiOutlinedInput-notchedOutline": {
                borderColor: "#064210", // Keep the border color when focused
              },
            },
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
