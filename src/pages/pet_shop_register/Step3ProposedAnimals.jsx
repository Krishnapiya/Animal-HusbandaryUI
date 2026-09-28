import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TextInput from "../../components/FormComponents/TextInput";

import { getAnimalSpeciesDropdown } from "../../api-client/petShopRegistration";

const Step3ProposedAnimals = ({
  animals,
  setAnimals,
}) => {
  const [allAnimalSpecies, setAllAnimalSpecies] = useState([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await getAnimalSpeciesDropdown();
        // Robust response-shape extraction
        const resData = response?.data !== undefined ? response.data : response;
        const payload = resData?.payLoad ?? resData?.payload ?? resData?.data ?? resData;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.content)
          ? payload.content
          : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(resData?.content)
          ? resData.content
          : [];

        const normalized = list.map((item) => ({
          ...item,
          id: item.id != null ? Number(item.id) : item.id,
          parentId: item.parentId != null && item.parentId !== "" ? Number(item.parentId) : null,
          name: item.speciesName || item.name || "",
          speciesName: item.speciesName || item.name || "",
        }));

        setAllAnimalSpecies(normalized);
      } catch (error) {
        console.error("Species loading error", error);
        setAllAnimalSpecies([]);
      }
    };

    fetchSpecies();
  }, []);

  // Top-level species only (parentId === null)
  const topLevelSpecies = useMemo(() => {
    return allAnimalSpecies.filter((item) => item.parentId == null);
  }, [allAnimalSpecies]);

  // Helper to extract numeric speciesId from animal object / primitive
  const getSpeciesId = useCallback((animal) => {
    if (!animal) return null;
    const raw =
      animal.species?.id ??
      animal.speciesId ??
      (typeof animal.species === "number"
        ? animal.species
        : animal.species != null && !isNaN(Number(animal.species)) && String(animal.species).trim() !== ""
        ? Number(animal.species)
        : null);
    return raw != null ? Number(raw) : null;
  }, []);

  // Filter breeds dynamically using parentId from the loaded Animal Species records
  const getBreedsForSpecies = useCallback(
    (speciesId) => {
      if (speciesId == null || speciesId === "") return [];
      return allAnimalSpecies.filter(
        (item) => item.parentId != null && Number(item.parentId) === Number(speciesId)
      );
    },
    [allAnimalSpecies]
  );

  // Helper to find selected breed ID for a row
  const getSelectedBreedId = useCallback((animal, rowBreeds) => {
    if (!animal) return "";
    const rawId =
      animal.breedId ??
      animal.breed?.id ??
      animal.breedObject?.id ??
      (typeof animal.breed === "number"
        ? animal.breed
        : animal.breed != null && !isNaN(Number(animal.breed)) && String(animal.breed).trim() !== ""
        ? Number(animal.breed)
        : null);

    if (rawId != null) {
      const match = rowBreeds.find((b) => Number(b.id) === Number(rawId));
      if (match) return match.id;
    }

    const rawName =
      typeof animal.breed === "string"
        ? animal.breed
        : (animal.breed?.speciesName || animal.breed?.name || animal.breedName || "");

    if (rawName) {
      const match = rowBreeds.find(
        (b) =>
          (b.speciesName && b.speciesName.toLowerCase() === rawName.toLowerCase()) ||
          (b.name && b.name.toLowerCase() === rawName.toLowerCase())
      );
      if (match) return match.id;
    }

    return "";
  }, []);

  // Hydrate draft animals once species list is available
  useEffect(() => {
    if (!allAnimalSpecies.length) return;

    setAnimals((prevAnimals) => {
      if (!Array.isArray(prevAnimals) || prevAnimals.length === 0) return prevAnimals;

      let hasChange = false;
      const updated = prevAnimals.map((animal) => {
        let changed = false;
        let newSpecies = animal.species;
        let newBreed = animal.breed;
        let newBreedId = animal.breedId;
        let newBreedObject = animal.breedObject;

        const specId = getSpeciesId(animal);
        if (specId != null && (!animal.species || !animal.species.name)) {
          const foundSpecies = topLevelSpecies.find(
            (s) => Number(s.id) === Number(specId)
          );
          if (foundSpecies) {
            newSpecies = foundSpecies;
            changed = true;
          }
        }

        if (specId != null) {
          const rowBreeds = allAnimalSpecies.filter(
            (item) => item.parentId != null && Number(item.parentId) === Number(specId)
          );

          if (rowBreeds.length > 0) {
            const matchedBreedId = getSelectedBreedId(animal, rowBreeds);
            const matched = rowBreeds.find((b) => Number(b.id) === Number(matchedBreedId));
            if (matched && (!animal.breedObject || animal.breedId !== matched.id || !animal.breed)) {
              newBreed = matched.speciesName || matched.name;
              newBreedId = matched.id;
              newBreedObject = matched;
              changed = true;
            }
          }
        }

        if (changed) {
          hasChange = true;
          return {
            ...animal,
            species: newSpecies,
            speciesId: specId,
            breed: newBreed,
            breedId: newBreedId,
            breedObject: newBreedObject,
          };
        }
        return animal;
      });

      return hasChange ? updated : prevAnimals;
    });
  }, [allAnimalSpecies, topLevelSpecies, getSpeciesId, getSelectedBreedId, setAnimals]);

  const addRow = () => {
    setAnimals([
      ...animals,
      {
        id: "",
        species: null,
        speciesId: null,
        gender: "",
        breed: "",
        breedId: null,
        breedObject: null,
        quantity: "",
        ageDescription: "",
        priceOffered: "",
        description: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setAnimals(animals.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...animals];
    updated[index][field] = value;
    setAnimals(updated);
  };

  // When species changes: clear breed immediately!
  const handleSpeciesChange = (index, speciesId) => {
    const selected = topLevelSpecies.find((s) => Number(s.id) === Number(speciesId)) || null;
    const updated = [...animals];
    updated[index] = {
      ...updated[index],
      species: selected,
      speciesId: selected ? selected.id : null,
      breed: "", // Cleared immediately!
      breedId: null,
      breedObject: null,
    };
    setAnimals(updated);
  };

  // When breed changes: store selected breed
  const handleBreedChange = (index, breedId, rowBreeds) => {
    const selectedBreed = rowBreeds.find((b) => Number(b.id) === Number(breedId)) || null;
    const updated = [...animals];
    updated[index] = {
      ...updated[index],
      breed: selectedBreed ? (selectedBreed.speciesName || selectedBreed.name) : "",
      breedId: selectedBreed ? selectedBreed.id : null,
      breedObject: selectedBreed,
    };
    setAnimals(updated);
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 3 }}
      >
        Step 3 - Proposed Animals
      </Typography>

      {Array.isArray(animals) &&
        animals.map((animal, index) => {
          const selectedSpeciesId = getSpeciesId(animal);
          const rowBreeds = getBreedsForSpecies(selectedSpeciesId);
          const currentBreedId = getSelectedBreedId(animal, rowBreeds);

          return (
            <Box
              key={index}
              sx={{
                mb: 3,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
              }}
            >
              <Grid container spacing={2}>
                {/* Animal Species Dropdown */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel id={`species-select-label-${index}`}>
                      Animal Species
                    </InputLabel>

                    <Select
                      labelId={`species-select-label-${index}`}
                      value={selectedSpeciesId != null ? selectedSpeciesId : ""}
                      label="Animal Species"
                      onChange={(e) =>
                        handleSpeciesChange(index, e.target.value)
                      }
                    >
                      {topLevelSpecies.map((item) => (
                        <MenuItem
                          key={item.id}
                          value={item.id}
                        >
                          {item.speciesName || item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Dependent Breed Dropdown */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth disabled={selectedSpeciesId == null}>
                    <InputLabel id={`breed-select-label-${index}`}>
                      Breed
                    </InputLabel>

                    <Select
                      labelId={`breed-select-label-${index}`}
                      value={currentBreedId}
                      label="Breed"
                      onChange={(e) =>
                        handleBreedChange(index, e.target.value, rowBreeds)
                      }
                    >
                      {selectedSpeciesId == null ? (
                        <MenuItem value="" disabled>
                          <em>Select Species First</em>
                        </MenuItem>
                      ) : rowBreeds.length === 0 ? (
                        <MenuItem value="" disabled>
                          <em>No Breeds Found</em>
                        </MenuItem>
                      ) : (
                        rowBreeds.map((item) => (
                          <MenuItem
                            key={item.id}
                            value={item.id}
                          >
                            {item.speciesName || item.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextInput
                    label="No. of Animals"
                    value={animal.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", e.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={animal.gender || ""}
                      label="Gender"
                      onChange={(e) =>
                        handleChange(index, "gender", e.target.value)
                      }
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Both">Both</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    label="Age Description"
                    value={animal.ageDescription}
                    onChange={(e) =>
                      handleChange(index, "ageDescription", e.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    label="Price Offered"
                    value={animal.priceOffered}
                    onChange={(e) =>
                      handleChange(index, "priceOffered", e.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextInput
                    multiline
                    rows={3}
                    label="Description"
                    value={animal.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                  />
                </Grid>
              </Grid>

              {animals.length > 1 && (
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeRow(index)}
                  sx={{ mt: 2 }}
                >
                  Remove
                </Button>
              )}
            </Box>
          );
        })}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={addRow}
      >
        Add Animal
      </Button>
    </Box>
  );
};

Step3ProposedAnimals.propTypes = {
  animals: PropTypes.array.isRequired,
  setAnimals: PropTypes.func.isRequired,
};

export default Step3ProposedAnimals;