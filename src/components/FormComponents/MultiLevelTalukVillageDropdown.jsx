import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid2";
import { getUserAttributes } from "../../utils";
const MultiLevelTalukVillageDropdown = ({
  data,
  levelsMapping,
  filterFetchParams,
  setFilterFetchParams,
  disablePortal,
  disableCloseOnSelect,
}) => {
  const userAttributes = getUserAttributes();
  const office_type_level = userAttributes["office_type_level"];
  const user_taluk = userAttributes["taluk"];
  const user_district = [6, 7].includes(office_type_level)
    ? userAttributes["district"]
    : null;
  const user_village =
    office_type_level === 7 ? userAttributes["office_id"] : null;
  const [selected, setSelected] = useState({
    district: user_district
      ? [user_district]
      : filterFetchParams[levelsMapping["district"]] || [],
    taluk: user_taluk
      ? [user_taluk]
      : filterFetchParams[levelsMapping["taluk"]] || [],
    village: user_village
      ? [user_village]
      : filterFetchParams[levelsMapping["village"]] || [],
  });

  useEffect(() => {
    const transformedSelected = Object.keys(levelsMapping).reduce(
      (acc, levelKey) => {
        const mappedKey = levelsMapping[levelKey];
        acc[mappedKey] = selected[levelKey];
        return acc;
      },
      {},
    );

    setFilterFetchParams({ ...filterFetchParams, ...transformedSelected });
  }, [selected]);

  useEffect(() => {
    if (data.length === 1) {
      // Automatically select the single entry in district
      const singleEntryId = data[0].id;
      setSelected((prev) => ({
        ...prev,
        district: [singleEntryId],
      }));
    }
  }, [data]);

  const getLevel2Options = () => {
    if (selected.district.length === 0)
      return data.flatMap((item) => item.children || []);
    return data
      .filter((item) => selected.district.includes(item.id))
      .flatMap((item) => item.children || []);
  };

  const getLevel3Options = () => {
    if (selected.taluk.length === 0)
      return getLevel2Options().flatMap((item) => item.children || []);
    return getLevel2Options()
      .filter((item) => selected.taluk.includes(item.id))
      .flatMap((item) => item.children || []);
  };

  const filterInvalidSelections = (level, newSelection) => {
    const allOptions = {
      district: data,
      taluk: getLevel2Options(),
      village: getLevel3Options(),
    };

    const validOptions = allOptions[level].map((item) => item.id);
    return newSelection.filter((id) => validOptions.includes(id));
  };

  const updateSelections = (level, newSelection) => {
    let updatedSelection = {
      ...selected,
      [level]: newSelection,
    };

    if (level === "district") {
      updatedSelection = {
        ...updatedSelection,
        taluk: filterInvalidSelections("taluk", updatedSelection.taluk),
        village: filterInvalidSelections("village", updatedSelection.village),
      };
    } else if (level === "taluk") {
      updatedSelection = {
        ...updatedSelection,
        village: filterInvalidSelections("village", updatedSelection.village),
      };
    }

    setSelected(updatedSelection);
  };

  const handleLevelChange = (level) => (event, newValue) => {
    updateSelections(
      level,
      newValue.map((item) => item.id),
    );
  };

  const renderOption = (props, option, isChecked) => (
    <ListItem {...props} button key={option.id}>
      <Checkbox checked={isChecked} edge="start" />
      <ListItemText primary={option.name} />
    </ListItem>
  );

  return (
    <div>
      {"district" in levelsMapping && (
        <Grid item size={{ xs: 12 }}>
          <Autocomplete
            disablePortal={disablePortal && true}
            multiple
            sx={{ marginTop: 1 }}
            disableCloseOnSelect={disableCloseOnSelect}
            limitTags={2}
            size="small"
            options={data}
            getOptionLabel={(option) => option.name}
            onChange={handleLevelChange("district")}
            value={data.filter((item) => selected.district.includes(item.id))}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="District"
                variant="outlined"
              />
            )}
            renderOption={(props, option) =>
              renderOption(props, option, selected.district.includes(option.id))
            }
            disabled={user_district}
          />
        </Grid>
      )}
      {"taluk" in levelsMapping && (
        <Grid item size={{ xs: 12 }}>
          <Autocomplete
            disablePortal={disablePortal && true}
            multiple
            sx={{ marginTop: 1 }}
            disableCloseOnSelect={disableCloseOnSelect}
            limitTags={2}
            size="small"
            options={getLevel2Options()}
            getOptionLabel={(option) => option.name}
            onChange={handleLevelChange("taluk")}
            value={getLevel2Options().filter((item) =>
              selected.taluk.includes(item.id),
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Taluk"
                variant="outlined"
              />
            )}
            renderOption={(props, option) =>
              renderOption(props, option, selected.taluk.includes(option.id))
            }
            disabled={user_taluk}
          />
        </Grid>
      )}
      {"village" in levelsMapping && (
        <Grid item size={{ xs: 12 }}>
          <Autocomplete
            disablePortal={disablePortal && true}
            multiple
            sx={{ marginTop: 1 }}
            disableCloseOnSelect={disableCloseOnSelect}
            limitTags={2}
            size="small"
            options={getLevel3Options()}
            getOptionLabel={(option) => option.name}
            onChange={handleLevelChange("village")}
            value={getLevel3Options().filter((item) =>
              selected.village.includes(item.id),
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Village"
                variant="outlined"
              />
            )}
            renderOption={(props, option) =>
              renderOption(props, option, selected.village.includes(option.id))
            }
            disabled={user_village}
          />
        </Grid>
      )}
    </div>
  );
};

MultiLevelTalukVillageDropdown.propTypes = {
  data: PropTypes.array.isRequired,
  disableCloseOnSelect: PropTypes.bool,
  disablePortal: PropTypes.bool,
  filterFetchParams: PropTypes.object.isRequired,
  levelsMapping: PropTypes.object.isRequired,
  setFilterFetchParams: PropTypes.func.isRequired,
};

export default MultiLevelTalukVillageDropdown;
