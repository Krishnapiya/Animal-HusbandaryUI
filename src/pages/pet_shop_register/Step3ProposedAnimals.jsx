import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TextInput from "../../components/FormComponents/TextInput";

import {
  getAnimalSpeciesDropdown,
} from "../../api-client/petShopRegistration";

const Step3ProposedAnimals = ({
  animals,
  setAnimals,
}) => {
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response =
          await getAnimalSpeciesDropdown();

        setSpeciesList(
          response?.data?.payLoad?.content || []
        );
      } catch (error) {
        console.error(
          "Species loading error",
          error
        );
        setSpeciesList([]);
      }
    };

    fetchSpecies();
  }, []);

  const addRow = () => {
    setAnimals([
      ...animals,
      {
        id: "",
        species: null,
        gender: "",
        breed: "",
        quantity: "",
        ageDescription: "",
        priceOffered: "",
        description: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setAnimals(
      animals.filter((_, i) => i !== index)
    );
  };

  const handleChange = (
    index,
    field,
    value
  ) => {
    const updated = [...animals];
    updated[index][field] = value;
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
  animals.map((animal, index) => (
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
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>
                  Animal Species
                </InputLabel>

                <Select
                  value={animal.species?.id || ""}
                  label="Animal Species"
                  onChange={(e) => {
                    const selected =
                      speciesList.find(
                        (s) =>
                          String(s.id) ===
                          String(e.target.value)
                      );

                    handleChange(
                      index,
                      "species",
                      selected
                    );
                  }}
                >
                 {Array.isArray(speciesList) &&
  speciesList.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextInput
                label="Breed"
                value={animal.breed}
                onChange={(e) =>
                  handleChange(
                    index,
                    "breed",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextInput
                  label="No. of Animals"
                value={animal.quantity}
                onChange={(e) =>
                  handleChange(
                    index,
                    "quantity",
                    e.target.value
                  )
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
        handleChange(
          index,
          "gender",
          e.target.value
        )
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
                  handleChange(
                    index,
                    "ageDescription",
                    e.target.value
                  )
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                label="Price Offered"
                value={animal.priceOffered}
                onChange={(e) =>
                  handleChange(
                    index,
                    "priceOffered",
                    e.target.value
                  )
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
                  handleChange(
                    index,
                    "description",
                    e.target.value
                  )
                }
              />
            </Grid>
          </Grid>

          {animals.length > 1 && (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() =>
                removeRow(index)
              }
              sx={{ mt: 2 }}
            >
              Remove
            </Button>
          )}
        </Box>
      ))}

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