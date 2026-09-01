/* eslint-disable */
import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import TextInput from "../../components/FormComponents/TextInput";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

// Single blank breed object structure
const createEmptyBreed = () => ({
  breedName: "",
  gender: "",
  dogCount: "",
  ageDescription: "",
});

const Step3DogBreedDetails = ({
  formValues,
  errors,
  isSaving,
  onChange,
  onBack,
  onSave,
}) => {
  const dogBreederDetailId = Number(formValues?.dogBreederDetailId || 0);

  // Initialize breeds list from formValues.breedsList or convert existing single values
  const breedsList =
    Array.isArray(formValues?.breedsList) && formValues.breedsList.length > 0
      ? formValues.breedsList
      : [
          {
            breedName: formValues?.breedName || "",
            gender: formValues?.gender || "",
            dogCount: formValues?.dogCount || "",
            ageDescription: formValues?.ageDescription || "",
          },
        ];

  // Helper to update state via parent's onChange prop
  const updateBreedsList = (updatedList) => {
    if (onChange) {
      onChange({
        target: {
          name: "breedsList",
          value: updatedList,
        },
      });
    }
  };

  // Handler for dynamic field updates (Breed Name, Gender, Dog Count, Age)
  const handleFieldChange = (index, fieldName, value) => {
    const updatedBreeds = breedsList.map((item, i) =>
      i === index ? { ...item, [fieldName]: value } : item
    );
    updateBreedsList(updatedBreeds);
  };

  // Add More Breeds handler
  const handleAddBreed = () => {
    const updatedBreeds = [...breedsList, createEmptyBreed()];
    updateBreedsList(updatedBreeds);
  };

  // Remove Breed entry
  const handleRemoveBreed = (index) => {
    const updatedBreeds = breedsList.filter((_, i) => i !== index);
    updateBreedsList(updatedBreeds);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: "Arial" }}>
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
        const breedErrors = errors?.[`breedsList_${index}`] || {};

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
                  mb: 1.5,
                }}
              >
                <Typography variant="subtitle2" color="primary">
                  Breed Details #{index + 1}
                </Typography>

                {breedsList.length > 1 && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveBreed(index)}
                    title="Remove this breed"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                {/* 1. BREED NAME */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextInput
                    label="Breed name"
                    name={`breedName_${index}`}
                    value={breed.breedName || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "breedName", e.target.value)
                    }
                    errors={breedErrors}
                    required
                  />
                </Grid>

                {/* 2. GENDER */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextInput
                    select
                    label="Gender"
                    name={`gender_${index}`}
                    value={breed.gender || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "gender", e.target.value)
                    }
                    errors={breedErrors}
                  >
                    <MenuItem value="">
                      <em>Select Gender</em>
                    </MenuItem>
                    {GENDER_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextInput>
                </Grid>

                {/* 3. NUMBER OF DOGS */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextInput
                    label="Number of dogs"
                    name={`dogCount_${index}`}
                    type="number"
                    value={breed.dogCount || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "dogCount", e.target.value)
                    }
                    errors={breedErrors}
                    required
                  />
                </Grid>

                {/* 4. AGE OF EACH DOG */}
                <Grid size={{ xs: 12 }}>
                  <TextInput
                    label="Age of each dog"
                    name={`ageDescription_${index}`}
                    value={breed.ageDescription || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "ageDescription", e.target.value)
                    }
                    errors={breedErrors}
                    multiline
                    minRows={2}
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
          variant="outlined"
          color="primary"
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