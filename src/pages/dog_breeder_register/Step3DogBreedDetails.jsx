import PropTypes from "prop-types";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import TextInput from "../../components/FormComponents/TextInput";
import { getAnimalSpeciesDropdown } from "../../api-client/petShopRegistration";
import { deleteDogBreederBreed } from "../../api-client/dogBreederBreed";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const Step3DogBreedDetails = ({
  formValues,
  errors,
  isSaving,
  onChange,
  onBack,
  onSave,
}) => {
  const dogBreederDetailId = Number(formValues?.dogBreederDetailId || 0);
  const [allAnimalSpecies, setAllAnimalSpecies] = useState([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await getAnimalSpeciesDropdown();
        const resData = response?.data !== undefined ? response.data : response;
        const payload =
          resData?.payLoad ?? resData?.payload ?? resData?.data ?? resData;
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
          parentId:
            item.parentId != null && item.parentId !== ""
              ? Number(item.parentId)
              : null,
          name: item.speciesName || item.name || "",
          speciesName: item.speciesName || item.name || "",
        }));

        setAllAnimalSpecies(normalized);
      } catch (error) {
        console.error("Species loading error in Dog Breeder", error);
        setAllAnimalSpecies([]);
      }
    };

    fetchSpecies();
  }, []);

  // Top-level species only (parentId === null)
  const topLevelSpecies = useMemo(() => {
    return allAnimalSpecies.filter((item) => item.parentId == null);
  }, [allAnimalSpecies]);

  // Find the top-level "Other" species record if present
  const otherSpeciesRecord = useMemo(() => {
    return (
      topLevelSpecies.find(
        (item) =>
          (item.speciesName || item.name || "").toLowerCase() === "other"
      ) || null
    );
  }, [topLevelSpecies]);

  // Find top-level "Dog" species record if present
  const dogSpeciesRecord = useMemo(() => {
    return (
      topLevelSpecies.find(
        (item) =>
          (item.speciesName || item.name || "").toLowerCase() === "dog"
      ) || null
    );
  }, [topLevelSpecies]);

  // Initialize breeds list from formValues.breedsList or single values
  const breedsList = useMemo(() => {
    if (
      Array.isArray(formValues?.breedsList) &&
      formValues.breedsList.length > 0
    ) {
      return formValues.breedsList;
    }
    return [
      {
        id: formValues?.id || "",
        species: null,
        speciesId: null,
        customSpeciesName: "",
        breed: formValues?.breedName || "",
        breedId: "",
        breedObject: null,
        customBreedName: "",
        gender: formValues?.gender || "",
        dogCount: formValues?.dogCount ?? "",
        ageDescription: formValues?.ageDescription || "",
        priceOffered: formValues?.priceOffered ?? "",
        description: formValues?.description || "",
        displayOrder: 0,
      },
    ];
  }, [
    formValues?.breedsList,
    formValues?.id,
    formValues?.breedName,
    formValues?.gender,
    formValues?.dogCount,
    formValues?.ageDescription,
    formValues?.priceOffered,
    formValues?.description,
  ]);

  // Helper to update state via parent's onChange prop
  const updateBreedsList = useCallback(
    (updatedList) => {
      if (onChange) {
        onChange({
          target: {
            name: "breedsList",
            value: updatedList,
          },
        });
      }
    },
    [onChange]
  );

  // Helper to extract numeric speciesId from breed row
  const getSpeciesId = useCallback((breedItem) => {
    if (!breedItem) return null;
    const raw =
      breedItem.species?.id ??
      breedItem.speciesId ??
      (typeof breedItem.species === "number"
        ? breedItem.species
        : breedItem.species != null &&
          !isNaN(Number(breedItem.species)) &&
          String(breedItem.species).trim() !== ""
        ? Number(breedItem.species)
        : null);
    return raw != null ? Number(raw) : null;
  }, []);

  // Check if a row has "Other" species selected
  const isOtherSpecies = useCallback(
    (breedItem) => {
      if (!breedItem) return false;
      const specId = getSpeciesId(breedItem);
      if (
        otherSpeciesRecord &&
        specId != null &&
        Number(specId) === Number(otherSpeciesRecord.id)
      ) {
        return true;
      }
      if (specId != null && Number(specId) === 24) {
        return true;
      }
      const rawName =
        breedItem.species?.speciesName ||
        breedItem.species?.name ||
        (typeof breedItem.species === "string" ? breedItem.species : "");
      return rawName.toLowerCase() === "other";
    },
    [getSpeciesId, otherSpeciesRecord]
  );

  // Filter breeds dynamically using parentId from master species records
  const getBreedsForSpecies = useCallback(
    (speciesId) => {
      if (speciesId == null || speciesId === "") return [];
      return allAnimalSpecies.filter(
        (item) =>
          item.parentId != null && Number(item.parentId) === Number(speciesId)
      );
    },
    [allAnimalSpecies]
  );

  // Helper to find selected breed ID for a row
  const getSelectedBreedId = useCallback((breedItem, rowBreeds) => {
    if (!breedItem) return "";

    if (
      breedItem.breedId === "OTHER" ||
      (typeof breedItem.breed === "string" &&
        breedItem.breed.toLowerCase() === "other") ||
      (breedItem.breed?.speciesName &&
        breedItem.breed.speciesName.toLowerCase() === "other") ||
      Boolean(
        breedItem.customBreedName &&
          String(breedItem.customBreedName).trim() !== ""
      )
    ) {
      return "OTHER";
    }

    const rawId =
      breedItem.breedId ??
      breedItem.breed?.id ??
      breedItem.breedObject?.id ??
      (typeof breedItem.breed === "number"
        ? breedItem.breed
        : breedItem.breed != null &&
          !isNaN(Number(breedItem.breed)) &&
          String(breedItem.breed).trim() !== ""
        ? Number(breedItem.breed)
        : null);

    if (rawId != null) {
      if (String(rawId).toUpperCase() === "OTHER") return "OTHER";
      const match = rowBreeds.find((b) => Number(b.id) === Number(rawId));
      if (match) return match.id;
    }

    const rawName =
      typeof breedItem.breed === "string"
        ? breedItem.breed
        : breedItem.breed?.speciesName ||
          breedItem.breed?.name ||
          breedItem.breedName ||
          "";

    if (rawName) {
      if (rawName.toLowerCase() === "other") return "OTHER";
      const match = rowBreeds.find(
        (b) =>
          (b.speciesName &&
            b.speciesName.toLowerCase() === rawName.toLowerCase()) ||
          (b.name && b.name.toLowerCase() === rawName.toLowerCase())
      );
      if (match) return match.id;
    }

    return "";
  }, []);

  // Check if a row has "Other" breed selected
  const isOtherBreed = useCallback(
    (breedItem, rowBreeds) => {
      if (!breedItem) return false;
      const currentBreedId = getSelectedBreedId(breedItem, rowBreeds);
      if (currentBreedId === "OTHER") return true;
      if (breedItem.breedId === "OTHER") return true;
      const rawBreed =
        typeof breedItem.breed === "string"
          ? breedItem.breed
          : breedItem.breed?.speciesName ||
            breedItem.breed?.name ||
            breedItem.breedName ||
            "";
      if (rawBreed && rawBreed.toLowerCase() === "other") return true;
      if (
        breedItem.customBreedName &&
        String(breedItem.customBreedName).trim() !== ""
      ) {
        return true;
      }
      return false;
    },
    [getSelectedBreedId]
  );

  // Hydrate draft breeds once species list is available
  useEffect(() => {
    if (!allAnimalSpecies.length || !topLevelSpecies.length) return;

    let hasChange = false;
    const updated = breedsList.map((item) => {
      let changed = false;
      let newSpecies = item.species;
      let newSpeciesId = item.speciesId;
      let newBreed = item.breed;
      let newBreedId = item.breedId;
      let newBreedObject = item.breedObject;
      let newCustomSpeciesName = item.customSpeciesName ?? "";
      let newCustomBreedName = item.customBreedName ?? "";

      const rawBreedName = (item.breedName || item.breed || "").trim();

      // If species is missing:
      if (newSpeciesId == null) {
        if (item.id) {
          // EXISTING RECORD (e.g. from draft or DB):
          // Check if rawBreedName matches a child breed in master table
          if (rawBreedName) {
            const matchedChild = allAnimalSpecies.find(
              (s) =>
                s.parentId != null &&
                (s.speciesName || s.name || "").toLowerCase() ===
                  rawBreedName.toLowerCase()
            );

            if (matchedChild && matchedChild.parentId != null) {
              const foundParent = topLevelSpecies.find(
                (p) => Number(p.id) === Number(matchedChild.parentId)
              );
              if (foundParent) {
                newSpecies = foundParent;
                newSpeciesId = foundParent.id;
                newBreed = matchedChild.speciesName || matchedChild.name;
                newBreedId = matchedChild.id;
                newBreedObject = matchedChild;
                changed = true;
              }
            }
          }
          // IMPORTANT FOR LEGACY RECORDS (e.g. 'gfgg'):
          // If not matched, DO NOT guess or force species!
          // Keep speciesId as null so legacy records load gracefully without data loss.
        } else {
          // NEW BLANK ITEM: default species to Dog
          const defaultParent = dogSpeciesRecord || topLevelSpecies[0] || null;
          if (defaultParent) {
            newSpecies = defaultParent;
            newSpeciesId = defaultParent.id;
            changed = true;
          }
        }
      } else if (!newSpecies && newSpeciesId != null) {
        const found = topLevelSpecies.find(
          (s) => Number(s.id) === Number(newSpeciesId)
        );
        if (found) {
          newSpecies = found;
          changed = true;
        }
      }

      // Reconcile breed dropdown if speciesId is known
      if (newSpeciesId != null) {
        const rowBreeds = allAnimalSpecies.filter(
          (b) => b.parentId != null && Number(b.parentId) === Number(newSpeciesId)
        );

        const isBreedOther =
          item.breedId === "OTHER" ||
          item.breed === "Other" ||
          (typeof item.breed === "string" &&
            item.breed.toLowerCase() === "other") ||
          Boolean(
            item.customBreedName && String(item.customBreedName).trim() !== ""
          );

        if (isBreedOther) {
          if (newBreedId !== "OTHER" || newBreed !== "Other") {
            newBreed = "Other";
            newBreedId = "OTHER";
            newBreedObject = { id: "OTHER", speciesName: "Other", name: "Other" };
            changed = true;
          }
        } else if (rowBreeds.length > 0 && (!newBreedId || !newBreed)) {
          const matchedBreedId = getSelectedBreedId(item, rowBreeds);
          const matched = rowBreeds.find(
            (b) => Number(b.id) === Number(matchedBreedId)
          );
          if (matched) {
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
          ...item,
          species: newSpecies,
          speciesId: newSpeciesId,
          breed: newBreed,
          breedId: newBreedId,
          breedObject: newBreedObject,
          customSpeciesName: newCustomSpeciesName,
          customBreedName: newCustomBreedName,
        };
      }
      return item;
    });

    if (hasChange) {
      updateBreedsList(updated);
    }
  }, [
    allAnimalSpecies,
    topLevelSpecies,
    dogSpeciesRecord,
    breedsList,
    getSelectedBreedId,
    updateBreedsList,
  ]);

  // Handler for dynamic field updates
  const handleFieldChange = (index, fieldName, value) => {
    const updated = breedsList.map((item, i) =>
      i === index ? { ...item, [fieldName]: value } : item
    );
    updateBreedsList(updated);
  };

  // Handler for species dropdown change
  const handleSpeciesChange = (index, speciesId) => {
    const selected =
      topLevelSpecies.find((s) => Number(s.id) === Number(speciesId)) || null;
    const isOther =
      selected &&
      ((selected.speciesName || selected.name || "").toLowerCase() === "other" ||
        Number(selected.id) === 24);

    const updated = breedsList.map((item, i) => {
      if (i !== index) return item;
      return {
        ...item,
        species: selected,
        speciesId: selected ? selected.id : null,
        customSpeciesName: isOther ? item.customSpeciesName || "" : "",
        breed: "", // Cleared immediately!
        breedId: "",
        breedObject: null,
        customBreedName: "", // Cleared immediately!
      };
    });
    updateBreedsList(updated);
  };

  // Handler for breed dropdown change
  const handleBreedChange = (index, breedId, rowBreeds) => {
    const updated = breedsList.map((item, i) => {
      if (i !== index) return item;
      if (breedId === "OTHER") {
        return {
          ...item,
          breed: "Other",
          breedId: "OTHER",
          breedObject: { id: "OTHER", speciesName: "Other", name: "Other" },
          customBreedName: item.customBreedName || "",
        };
      }
      if (!breedId) {
        return {
          ...item,
          breed: "",
          breedId: "",
          breedObject: null,
          customBreedName: "",
        };
      }
      const selectedBreed =
        rowBreeds.find((b) => Number(b.id) === Number(breedId)) || null;
      return {
        ...item,
        breed: selectedBreed
          ? selectedBreed.speciesName || selectedBreed.name
          : "",
        breedId: selectedBreed ? selectedBreed.id : "",
        breedObject: selectedBreed,
        customBreedName: "",
      };
    });
    updateBreedsList(updated);
  };

  // Add More Breed handler
  const handleAddBreed = () => {
    const defaultParent = dogSpeciesRecord || topLevelSpecies[0] || null;
    const newBreed = {
      id: "",
      species: defaultParent,
      speciesId: defaultParent ? defaultParent.id : null,
      customSpeciesName: "",
      breed: "",
      breedId: "",
      breedObject: null,
      customBreedName: "",
      gender: "",
      dogCount: "",
      ageDescription: "",
      priceOffered: "",
      description: "",
      displayOrder: breedsList.length,
    };
    updateBreedsList([...breedsList, newBreed]);
  };

  // Remove Breed entry
  const handleRemoveBreed = async (index) => {
    if (breedsList.length <= 1) return;
    const itemToRemove = breedsList[index];

    // If already persisted in backend, remove via API
    if (itemToRemove?.id) {
      try {
        await deleteDogBreederBreed(itemToRemove.id);
      } catch (err) {
        console.warn("Could not delete breed via API, removing from local state", err);
      }
    }

    const updated = breedsList.filter((_, i) => i !== index);
    updateBreedsList(updated);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, fontFamily: "Arial" }}>
        Section 3 — Dog breed details
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Details of dogs proposed to be bred in the establishment.
      </Typography>

      {!dogBreederDetailId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Dog breeder detail ID missing. Please save Step 1 first.
        </Alert>
      )}

      {/* DYNAMIC BREED CARDS */}
      {breedsList.map((breed, index) => {
        const breedErrors = errors?.[`breedsList_${index}`] || errors || {};
        const selectedSpeciesId = getSpeciesId(breed);
        const rowBreeds = getBreedsForSpecies(selectedSpeciesId);
        const currentBreedId = getSelectedBreedId(breed, rowBreeds);

        const isLegacyRecord = Boolean(breed.id && !selectedSpeciesId && breed.breedName);

        const speciesHasError = Boolean(
          breedErrors.speciesId || breedErrors.species
        );
        const breedHasError = Boolean(
          breedErrors.breedId || breedErrors.breed
        );
        const genderHasError = Boolean(breedErrors.gender);

        return (
          <Card
            key={index}
            variant="outlined"
            sx={{
              mb: 2.5,
              backgroundColor: "background.paper",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    Breed Details #{index + 1}
                  </Typography>
                  {isLegacyRecord && (
                    <Chip
                      size="small"
                      color="warning"
                      label={`Legacy: "${breed.breedName}"`}
                      variant="outlined"
                    />
                  )}
                </Box>

                {breedsList.length > 1 && (
                  <Button
                    color="error"
                    size="small"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleRemoveBreed(index)}
                    sx={{ textTransform: "none" }}
                  >
                    Remove
                  </Button>
                )}
              </Box>

              {isLegacyRecord && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Legacy record with breed <strong>&quot;{breed.breedName}&quot;</strong> has no species assigned. Please select an Animal Species to update this entry.
                </Alert>
              )}

              <Grid container spacing={2}>
                {/* 1. ANIMAL SPECIES DROPDOWN */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth error={speciesHasError}>
                    <InputLabel id={`species-select-label-${index}`} required>
                      Animal Species
                    </InputLabel>
                    <Select
                      labelId={`species-select-label-${index}`}
                      value={selectedSpeciesId != null ? selectedSpeciesId : ""}
                      label="Animal Species *"
                      onChange={(e) =>
                        handleSpeciesChange(index, e.target.value)
                      }
                    >
                      {topLevelSpecies.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.speciesName || item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {speciesHasError && (
                      <FormHelperText>
                        {breedErrors.speciesId || breedErrors.species}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* 2. CUSTOM SPECIES NAME TEXT INPUT */}
                {isOtherSpecies(breed) && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextInput
                      required
                      label="Custom Species Name"
                      name={`customSpeciesName_${index}`}
                      value={breed.customSpeciesName || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "customSpeciesName",
                          e.target.value
                        )
                      }
                      error={Boolean(breedErrors.customSpeciesName)}
                      helperText={breedErrors.customSpeciesName}
                      inputProps={{ maxLength: 120 }}
                    />
                  </Grid>
                )}

                {/* 3. DEPENDENT BREED DROPDOWN */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl
                    fullWidth
                    disabled={selectedSpeciesId == null}
                    error={breedHasError}
                  >
                    <InputLabel id={`breed-select-label-${index}`} required>
                      Breed
                    </InputLabel>
                    <Select
                      labelId={`breed-select-label-${index}`}
                      value={currentBreedId || ""}
                      label="Breed *"
                      onChange={(e) =>
                        handleBreedChange(index, e.target.value, rowBreeds)
                      }
                    >
                      {selectedSpeciesId == null ? (
                        <MenuItem value="" disabled>
                          <em>{breed.breedName ? `Current: ${breed.breedName} (Select Species First)` : "Select Species First"}</em>
                        </MenuItem>
                      ) : (
                        [
                          <MenuItem key="empty" value="">
                            <em>Select Breed</em>
                          </MenuItem>,
                          ...rowBreeds.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.speciesName || item.name}
                            </MenuItem>
                          )),
                          !rowBreeds.some(
                            (b) =>
                              (b.speciesName || b.name || "").toLowerCase() ===
                              "other"
                          ) && (
                            <MenuItem key="OTHER" value="OTHER">
                              Other
                            </MenuItem>
                          ),
                        ].filter(Boolean)
                      )}
                    </Select>
                    {breedHasError && (
                      <FormHelperText>
                        {breedErrors.breedId || breedErrors.breed}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* 4. CUSTOM BREED NAME TEXT INPUT */}
                {isOtherBreed(breed, rowBreeds) && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextInput
                      required
                      label="Custom Breed Name"
                      name={`customBreedName_${index}`}
                      value={breed.customBreedName || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "customBreedName",
                          e.target.value
                        )
                      }
                      error={Boolean(breedErrors.customBreedName)}
                      helperText={breedErrors.customBreedName}
                      inputProps={{ maxLength: 120 }}
                    />
                  </Grid>
                )}

                {/* 5. GENDER DROPDOWN */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth error={genderHasError}>
                    <InputLabel id={`gender-select-label-${index}`} required>
                      Gender
                    </InputLabel>
                    <Select
                      labelId={`gender-select-label-${index}`}
                      value={breed.gender || ""}
                      label="Gender *"
                      onChange={(e) =>
                        handleFieldChange(index, "gender", e.target.value)
                      }
                    >
                      <MenuItem value="">
                        <em>Select Gender</em>
                      </MenuItem>
                      {GENDER_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {genderHasError && (
                      <FormHelperText>{breedErrors.gender}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* 6. NUMBER OF DOGS */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextInput
                    required
                    type="number"
                    label="Number of dogs"
                    name={`dogCount_${index}`}
                    value={breed.dogCount ?? ""}
                    onChange={(e) =>
                      handleFieldChange(index, "dogCount", e.target.value)
                    }
                    error={Boolean(
                      breedErrors.dogCount || breedErrors[`dogCount_${index}`]
                    )}
                    helperText={
                      breedErrors.dogCount || breedErrors[`dogCount_${index}`]
                    }
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                {/* 7. AGE OF EACH DOG */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    label="Age of each dog"
                    name={`ageDescription_${index}`}
                    value={breed.ageDescription || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "ageDescription", e.target.value)
                    }
                    error={Boolean(
                      breedErrors.ageDescription ||
                        breedErrors[`ageDescription_${index}`]
                    )}
                    helperText={
                      breedErrors.ageDescription ||
                        breedErrors[`ageDescription_${index}`]
                    }
                  />
                </Grid>

                {/* 8. PRICE OFFERED */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    label="Price Offered"
                    name={`priceOffered_${index}`}
                    type="number"
                    value={breed.priceOffered ?? ""}
                    onChange={(e) =>
                      handleFieldChange(index, "priceOffered", e.target.value)
                    }
                    error={Boolean(breedErrors.priceOffered)}
                    helperText={breedErrors.priceOffered}
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </Grid>

                {/* 9. DESCRIPTION */}
                <Grid size={{ xs: 12 }}>
                  <TextInput
                    multiline
                    rows={3}
                    label="Description"
                    name={`description_${index}`}
                    value={breed.description || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "description", e.target.value)
                    }
                    error={Boolean(breedErrors.description)}
                    helperText={breedErrors.description}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}

      {/* ADD MORE BREEDS BUTTON */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBreed}
          sx={{ textTransform: "none" }}
        >
          Add More Breed
        </Button>
      </Box>

      {/* ACTION BUTTONS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ textTransform: "none" }}
        >
          Back to facility
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          endIcon={<NavigateNextIcon />}
          onClick={onSave}
          disabled={isSaving || !dogBreederDetailId}
          sx={{ textTransform: "none", backgroundColor: "#2563eb" }}
        >
          {isSaving ? "Saving..." : "Save & Continue"}
        </Button>
      </Box>
    </Box>
  );
};

Step3DogBreedDetails.propTypes = {
  formValues: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Step3DogBreedDetails;
