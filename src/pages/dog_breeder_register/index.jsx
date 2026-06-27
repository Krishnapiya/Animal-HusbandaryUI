import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "material-react-toastify";

import WizardStepper from "./WizardStepper";
import Step1BreederDetails from "./Step1BreederDetails";
import Step2FacilityInfrastructure from "./Step2FacilityInfrastructure";
import Step3DogBreedDetails from "./Step3DogBreedDetails";
import Step4Declaration from "./Step4Declaration";
import Step6Preview from "./Step6Preview";

import {
  getDogBreederRegistrationDraft,
  saveDogBreederDetail,
} from "../../api-client/dogBreederRegistration";
import { saveDogBreederFacility } from "../../api-client/dogBreederFacility";
import { saveDogBreederBreed } from "../../api-client/dogBreederBreed";
import { saveDogBreederDeclaration } from "../../api-client/dogBreederDeclaration";
import { getUserAttributes } from "../../utils";

const initialStep1 = {
  id: "",
  applicationId: "",
  district: null,
  breederName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  pincode: "",
  contactMobile: "",
  contactEmail: "",
  facilityDetails: "",
  totalDogsCount: "",
};

const initialStep2 = {
  id: "",
  dogBreederDetailId: "",
  accommodationInfrastructure: "",
  workingHours: "",
  restDay: "",
  ventilationArrangement: "",
  lightingArrangement: "",
  heatingCoolingArrangement: "",
  foodStorageArrangement: "",
  cleanlinessWasteArrangement: "",
  deadAnimalDisposalArrangement: "",
  veterinarySupportArrangement: "",
  cageEnclosureDetails: "",
};

const initialStep3 = {
  id: "",
  dogBreederDetailId: "",
  breedName: "",
  dogCount: "",
  ageDescription: "",
};

const initialStep4 = {
  id: "",
  dogBreederDetailId: "",
  qualificationExperience: "",
  declarationAccepted: false,
  declarationPlace: "",
  declarationDate: new Date().toISOString().slice(0, 10),
  applicantName: "",
  signatureName: "",
  signedAt: "",
};

const buildInitialFormValues = (user) => ({
  ...initialStep1,
  breederName:
    user?.fname && user?.lname
      ? `${user.fname} ${user.lname}`.trim()
      : initialStep1.breederName,
  contactEmail: user?.email || initialStep1.contactEmail,
  contactMobile: user?.mobileNo || initialStep1.contactMobile,
});

const getResponsePayload = (response) => {
  return (
    response?.data?.payLoad ??
    response?.data?.payload ??
    response?.payLoad ??
    response?.payload ??
    response?.data?.data ??
    response?.data ??
    null
  );
};

const toValidNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0;
};

const extractDogBreederDetailId = (responseOrPayload) => {
  const payload = getResponsePayload(responseOrPayload) ?? responseOrPayload;

  if (!payload) {
    return 0;
  }

  const contentFirst = Array.isArray(payload?.content)
    ? payload.content[0]
    : null;

  const candidates = [
    payload?.dogBreederDetailId,
    payload?.dog_breeder_detail_id,
    payload?.dogBreederDetail?.id,
    payload?.dogBreederDetailDto?.id,
    payload?.dogBreederDetailDTO?.id,
    payload?.breederDetail?.id,
    payload?.breederDetailId,
    payload?.detail?.id,
    payload?.detailId,

    contentFirst?.dogBreederDetailId,
    contentFirst?.dog_breeder_detail_id,
    contentFirst?.dogBreederDetail?.id,
    contentFirst?.dogBreederDetailDto?.id,
    contentFirst?.breederDetail?.id,
    contentFirst?.detailId,
  ];

  for (const candidate of candidates) {
    const validId = toValidNumber(candidate);
    if (validId) {
      return validId;
    }
  }

  return 0;
};

const extractApplicationId = (responseOrPayload) => {
  const payload = getResponsePayload(responseOrPayload) ?? responseOrPayload;

  if (!payload) {
    return "";
  }

  const candidates = [
    payload?.applicationId,
    payload?.application?.id,
    payload?.registrationApplicationId,
    payload?.registrationApplication?.id,
  ];

  for (const candidate of candidates) {
    const validId = toValidNumber(candidate);
    if (validId) {
      return validId;
    }
  }

  return "";
};

const DogBreederRegisterPage = () => {
  const user = getUserAttributes();

  const [activeStep, setActiveStep] = useState(0);

  const [formValues, setFormValues] = useState(buildInitialFormValues(user));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const [facilityValues, setFacilityValues] = useState(initialStep2);
  const [facilityErrors, setFacilityErrors] = useState({});
  const [isSavingFacility, setIsSavingFacility] = useState(false);

  const [breedValues, setBreedValues] = useState(initialStep3);
  const [breedErrors, setBreedErrors] = useState({});
  const [isSavingBreed, setIsSavingBreed] = useState(false);

  const [declarationValues, setDeclarationValues] = useState(initialStep4);
  const [declarationErrors, setDeclarationErrors] = useState({});
  const [isSavingDeclaration, setIsSavingDeclaration] = useState(false);

  const [previewValues, setPreviewValues] = useState(null);

  const handlePreviewClick = () => {
    setPreviewValues({
      breederDetails: formValues,
      facilityDetails: facilityValues,
      breedDetails: breedValues?.breedName ? [breedValues] : [],
      declarationDetails: declarationValues,
      documentDetails: [],
    });
  };

  const handleChange = (event) => {
    setFormValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [event.target.name]: "",
    }));
  };

  const handleDropDownChange = (_, value, name) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formValues.district) {
      newErrors.district = "District is required";
    }

    if (!formValues.breederName) {
      newErrors.breederName = "Breeder name is required";
    }

    if (!formValues.addressLine1) {
      newErrors.addressLine1 = "Address line 1 is required";
    }

    if (!formValues.city) {
      newErrors.city = "City is required";
    }

    if (!formValues.pincode) {
      newErrors.pincode = "Pincode is required";
    }

    if (!formValues.contactMobile) {
      newErrors.contactMobile = "Mobile number is required";
    }

    if (!formValues.contactEmail) {
      newErrors.contactEmail = "Email is required";
    }

    if (!formValues.facilityDetails) {
      newErrors.facilityDetails =
        "Accommodation and infrastructure details are required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const buildStep1Payload = () => ({
    id: formValues.id || null,
    applicationId: formValues.applicationId || null,
    districtId: formValues.district?.id ?? null,
    breederName: formValues.breederName,
    addressLine1: formValues.addressLine1,
    addressLine2: formValues.addressLine2,
    city: formValues.city,
    pincode: formValues.pincode,
    contactMobile: formValues.contactMobile,
    contactEmail: formValues.contactEmail,
    facilityDetails: formValues.facilityDetails,
    totalDogsCount: formValues.totalDogsCount
      ? Number(formValues.totalDogsCount)
      : null,
  });

  const handleSaveStep1 = async () => {
    if (!validateStep1()) {
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});

      const response = await saveDogBreederDetail(buildStep1Payload());

      const payload = getResponsePayload(response);

      let savedDogBreederDetailId = extractDogBreederDetailId(payload);
      let savedApplicationId = extractApplicationId(payload);

      if (!savedDogBreederDetailId) {
        const draftResponse = await getDogBreederRegistrationDraft();
        const draftPayload = getResponsePayload(draftResponse);

        savedDogBreederDetailId = extractDogBreederDetailId(draftPayload);
        savedApplicationId =
          savedApplicationId || extractApplicationId(draftPayload);
      }

      if (!savedDogBreederDetailId) {
        toast.error(
          "Dog breeder detail ID missing. Please check Step 1 API response."
        );
        return;
      }

      setFormValues((prev) => ({
        ...prev,
        id: savedDogBreederDetailId,
        applicationId: savedApplicationId || prev.applicationId,
      }));

      setFacilityValues((prev) => ({
        ...prev,
        dogBreederDetailId: savedDogBreederDetailId,
      }));

      setBreedValues((prev) => ({
        ...prev,
        dogBreederDetailId: savedDogBreederDetailId,
      }));

      setDeclarationValues((prev) => ({
        ...prev,
        dogBreederDetailId: savedDogBreederDetailId,
        applicantName: prev.applicantName || formValues.breederName,
        signatureName: prev.signatureName || formValues.breederName,
      }));

      setDraftLoaded(true);
      setPreviewValues(null);

      toast.success("Draft saved. Continue with the next sections.");
      setActiveStep(1);
    } catch (error) {
      const data = error?.response?.data;

      if (typeof data === "object") {
        setErrors(data?.errors || data);
      }

      toast.error(
        data?.resultString ||
          data?.detail ||
          "Could not save breeder details"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFacilityChange = (event) => {
    setFacilityValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setFacilityErrors((prev) => ({
      ...prev,
      [event.target.name]: "",
    }));
  };

  const validateFacility = () => {
    const newErrors = {};

    if (!facilityValues.accommodationInfrastructure) {
      newErrors.accommodationInfrastructure =
        "Accommodation infrastructure is required";
    }

    if (!facilityValues.workingHours) {
      newErrors.workingHours = "Working hours is required";
    }

    if (!facilityValues.restDay) {
      newErrors.restDay = "Rest day is required";
    }

    setFacilityErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveFacility = async () => {
    if (!validateFacility()) {
      return;
    }

    let dogBreederDetailId = toValidNumber(facilityValues.dogBreederDetailId);

    if (!dogBreederDetailId) {
      try {
        const draftResponse = await getDogBreederRegistrationDraft();
        const draftPayload = getResponsePayload(draftResponse);

        dogBreederDetailId = extractDogBreederDetailId(draftPayload);
      } catch {
        toast.error("Could not load saved draft details.");
        return;
      }
    }

    if (!dogBreederDetailId) {
      toast.error("Please save Step 1 first. Dog breeder detail ID missing.");
      return;
    }

    try {
      setIsSavingFacility(true);
      setFacilityErrors({});

      const payload = {
        id: facilityValues.id || null,
        dogBreederDetailId,
        accommodationInfrastructure:
          facilityValues.accommodationInfrastructure,
        workingHours: facilityValues.workingHours,
        restDay: facilityValues.restDay,
        ventilationArrangement: facilityValues.ventilationArrangement,
        lightingArrangement: facilityValues.lightingArrangement,
        heatingCoolingArrangement: facilityValues.heatingCoolingArrangement,
        foodStorageArrangement: facilityValues.foodStorageArrangement,
        cleanlinessWasteArrangement:
          facilityValues.cleanlinessWasteArrangement,
        deadAnimalDisposalArrangement:
          facilityValues.deadAnimalDisposalArrangement,
        veterinarySupportArrangement:
          facilityValues.veterinarySupportArrangement,
        cageEnclosureDetails: facilityValues.cageEnclosureDetails,
      };

      const response = await saveDogBreederFacility(payload);

      if (response?.isSuccess === false) {
        const data = response?.data ?? {};

        if (typeof data === "object") {
          setFacilityErrors(data?.errors || data);
        }

        toast.error(
          data?.resultString ||
            data?.detail ||
            "Could not save facility details"
        );

        return;
      }

      const savedData = getResponsePayload(response) || payload;

      setFacilityValues((prev) => ({
        ...prev,
        ...savedData,
        dogBreederDetailId,
      }));

      setBreedValues((prev) => ({
        ...prev,
        dogBreederDetailId,
      }));

      setDeclarationValues((prev) => ({
        ...prev,
        dogBreederDetailId,
      }));

      setPreviewValues(null);

      toast.success("Facility details saved successfully");
      setActiveStep(2);
    } catch (error) {
      const data = error?.response?.data;

      if (typeof data === "object") {
        setFacilityErrors(data?.errors || data);
      }

      toast.error(
        data?.resultString ||
          data?.detail ||
          "Could not save facility details"
      );
    } finally {
      setIsSavingFacility(false);
    }
  };

  const handleBreedChange = (event) => {
    setBreedValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setBreedErrors((prev) => ({
      ...prev,
      [event.target.name]: "",
    }));
  };

  const validateBreed = () => {
    const newErrors = {};

    if (!breedValues.breedName) {
      newErrors.breedName = "Breed name is required";
    }

    if (
      breedValues.dogCount === "" ||
      breedValues.dogCount === null ||
      Number(breedValues.dogCount) < 0
    ) {
      newErrors.dogCount = "Valid dog count is required";
    }

    setBreedErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveBreed = async () => {
    if (!validateBreed()) {
      return;
    }

    const dogBreederDetailId =
      toValidNumber(breedValues.dogBreederDetailId) ||
      toValidNumber(facilityValues.dogBreederDetailId) ||
      toValidNumber(formValues.id);

    if (!dogBreederDetailId) {
      toast.error("Please save Step 1 first. Dog breeder detail ID missing.");
      return;
    }

    try {
      setIsSavingBreed(true);
      setBreedErrors({});

      const payload = {
        id: breedValues.id || null,
        dogBreederDetail: {
          id: dogBreederDetailId,
        },
        breedName: breedValues.breedName,
        dogCount: breedValues.dogCount ? Number(breedValues.dogCount) : 0,
        ageDescription: breedValues.ageDescription,
      };

      const response = await saveDogBreederBreed(payload);

      if (response?.isSuccess === false) {
        const data = response?.data ?? {};

        if (typeof data === "object") {
          setBreedErrors(data?.errors || data);
        }

        toast.error(
          data?.resultString ||
            data?.detail ||
            "Could not save dog breed details"
        );

        return;
      }

      const savedData = getResponsePayload(response) || payload;

      setBreedValues((prev) => ({
        ...prev,
        ...savedData,
        dogBreederDetailId,
      }));

      setDeclarationValues((prev) => ({
        ...prev,
        dogBreederDetailId,
        applicantName: prev.applicantName || formValues.breederName,
        signatureName: prev.signatureName || formValues.breederName,
      }));

      setPreviewValues(null);

      toast.success("Dog breed details saved successfully");
      setActiveStep(3);
    } catch (error) {
      const data = error?.response?.data;

      if (typeof data === "object") {
        setBreedErrors(data?.errors || data);
      }

      toast.error(
        data?.resultString ||
          data?.detail ||
          "Could not save dog breed details"
      );
    } finally {
      setIsSavingBreed(false);
    }
  };

  const handleDeclarationChange = (event) => {
    setDeclarationValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setDeclarationErrors((prev) => ({
      ...prev,
      [event.target.name]: "",
    }));
  };

  const handleDeclarationCheckboxChange = (event) => {
    setDeclarationValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));

    setDeclarationErrors((prev) => ({
      ...prev,
      [event.target.name]: "",
    }));
  };

  const validateDeclaration = () => {
    const newErrors = {};

    if (!declarationValues.qualificationExperience) {
      newErrors.qualificationExperience =
        "Qualification and experience is required";
    }

    if (!declarationValues.declarationPlace) {
      newErrors.declarationPlace = "Place is required";
    }

    if (!declarationValues.declarationDate) {
      newErrors.declarationDate = "Declaration date is required";
    }

    if (!declarationValues.declarationAccepted) {
      newErrors.declarationAccepted = "Please accept the declaration";
    }

    setDeclarationErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDeclaration = async () => {
    if (!validateDeclaration()) {
      return;
    }

    const dogBreederDetailId =
      toValidNumber(declarationValues.dogBreederDetailId) ||
      toValidNumber(breedValues.dogBreederDetailId) ||
      toValidNumber(facilityValues.dogBreederDetailId) ||
      toValidNumber(formValues.id);

    if (!dogBreederDetailId) {
      toast.error("Please save Step 1 first. Dog breeder detail ID missing.");
      return;
    }

    try {
      setIsSavingDeclaration(true);
      setDeclarationErrors({});

      const payload = {
        id: declarationValues.id || null,
        dogBreederDetail: {
          id: dogBreederDetailId,
        },
        qualificationExperience:
          declarationValues.qualificationExperience,
        declarationAccepted: declarationValues.declarationAccepted,
        declarationPlace: declarationValues.declarationPlace,
        declarationDate: declarationValues.declarationDate,
        applicantName: declarationValues.applicantName,
        signatureName: declarationValues.signatureName,
        signedAt: new Date().toISOString().slice(0, 19),
      };

      const response = await saveDogBreederDeclaration(payload);

      if (response?.isSuccess === false) {
        const data = response?.data ?? {};

        if (typeof data === "object") {
          setDeclarationErrors(data?.errors || data);
        }

        toast.error(
          data?.resultString ||
            data?.detail ||
            "Could not save declaration"
        );

        return;
      }

      const savedData = getResponsePayload(response) || payload;

      setDeclarationValues((prev) => ({
        ...prev,
        ...savedData,
        dogBreederDetailId,
      }));

      setPreviewValues(null);

      toast.success("Declaration saved successfully");
      setActiveStep(4);
    } catch (error) {
      const data = error?.response?.data;

      if (typeof data === "object") {
        setDeclarationErrors(data?.errors || data);
      }

      toast.error(
        data?.resultString ||
          data?.detail ||
          "Could not save declaration"
      );
    } finally {
      setIsSavingDeclaration(false);
    }
  };

  return (
    <Box sx={{ p: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography
        variant="h5"
        sx={{ mb: 1, fontWeight: 700, color: "#1e3a8a" }}
      >
        Dog Breeder Registration
      </Typography>

      {draftLoaded && formValues.applicationId && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Continuing saved draft (application #{formValues.applicationId}).
        </Alert>
      )}

      <WizardStepper activeStep={activeStep} />

      <Card sx={{ border: "1px solid #e5e7eb" }}>
        <CardContent>
          {activeStep === 0 && (
            <Step1BreederDetails
              formValues={formValues}
              errors={errors}
              onChange={handleChange}
              onDropDownChange={handleDropDownChange}
            />
          )}

          {activeStep === 1 && (
            <Step2FacilityInfrastructure
              formValues={facilityValues}
              errors={facilityErrors}
              isSaving={isSavingFacility}
              onChange={handleFacilityChange}
              onBack={() => setActiveStep(0)}
              onSave={handleSaveFacility}
            />
          )}

          {activeStep === 2 && (
            <Step3DogBreedDetails
              formValues={breedValues}
              errors={breedErrors}
              isSaving={isSavingBreed}
              onChange={handleBreedChange}
              onBack={() => setActiveStep(1)}
              onSave={handleSaveBreed}
            />
          )}

          {activeStep === 3 && (
            <Step4Declaration
              formValues={declarationValues}
              errors={declarationErrors}
              isSaving={isSavingDeclaration}
              onChange={handleDeclarationChange}
              onCheckboxChange={handleDeclarationCheckboxChange}
              onBack={() => setActiveStep(2)}
              onSave={handleSaveDeclaration}
            />
          )}

          {activeStep === 4 && (
            <>
              {!previewValues && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Preview Application
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Click Preview to view FORM-I dog breeder application details.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={handlePreviewClick}
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#2563eb",
                    }}
                  >
                    Preview
                  </Button>
                </Box>
              )}

              {previewValues && (
                <Step6Preview
                  breederDetails={previewValues.breederDetails}
                  facilityDetails={previewValues.facilityDetails}
                  breedDetails={previewValues.breedDetails}
                  declarationDetails={previewValues.declarationDetails}
                  documentDetails={previewValues.documentDetails}
                />
              )}
            </>
          )}

          {activeStep === 5 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Payment & Submit
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Payment section will be enabled in the next sprint.
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 3,
            }}
          >
            {activeStep === 0 && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveStep1}
                disabled={isSaving}
                sx={{ textTransform: "none", backgroundColor: "#2563eb" }}
              >
                {isSaving ? "Saving..." : "Save & Continue"}
              </Button>
            )}

            {activeStep === 4 && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setPreviewValues(null);
                    setActiveStep(3);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Back
                </Button>

                {previewValues && (
                  <Button
                    variant="contained"
                    endIcon={<NavigateNextIcon />}
                    onClick={() => setActiveStep(5)}
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#2563eb",
                    }}
                  >
                    Proceed to Payment
                  </Button>
                )}
              </>
            )}

            {activeStep === 5 && (
              <Button
                variant="outlined"
                onClick={() => setActiveStep(4)}
                sx={{ textTransform: "none" }}
              >
                Back to Preview
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DogBreederRegisterPage;