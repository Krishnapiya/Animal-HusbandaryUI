import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import Step3ProposedAnimals from "./Step3ProposedAnimals.jsx";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "material-react-toastify";
import WizardStepper from "./WizardStepper";
import Step1ShopOwner from "./Step1ShopOwner";
import Step5Documents from "./Step5Documents";
import Step2FacilityInfrastructure from "./Step2FacilityInfrastructure";
import Step4DeclarationAffidavit from "./Step4DeclarationAffidavit.jsx";
import Step6PaymentSubmit from "./Step6PaymentSubmit";
import {
  getPetShopFacility,
  getPetShopRegistrationDraft,
  savePetShopRegistrationStep1,
  savePetShopRegistrationStep2,
   updatePetShopRegistrationStep2,
   savePetShopProposedAnimal,
   getPetShopProposedAnimals,
    updatePetShopProposedAnimal,
    saveApplicationDeclaration,
    updateApplicationDeclaration,
    getApplicationDeclaration,
    
} from "../../api-client/petShopRegistration";
import { getUserAttributes } from "../../utils";

const initialStep1 = {
  applicationId: "",
  detailId: "",
  district: null,
  shopName: "",
  shopAddressLine1: "",
  shopAddressLine2: "",
  shopCity: "",
  shopPincode: "",
  ownerName: "",
  ownerResidentialAddress: "",
  ownerAddressLine1: "",
  ownerAddressLine2: "",
  ownerCity: "",
  ownerPincode: "",
  ownerOfficeAddress: "",
  contactLandline: "",
  contactMobile: "",
  contactEmail: "",
  latitude: "",
  longitude: "",
  sameAsShop: false,
};

const buildInitialFormValues = (user) => ({
  ...initialStep1,
  ownerName:
    user?.fname && user?.lname
      ? `${user.fname} ${user.lname}`.trim()
      : initialStep1.ownerName,
  contactEmail: user?.email || initialStep1.contactEmail,
  contactMobile: user?.mobileNo || initialStep1.contactMobile,
});

const isSameAsShop = (draft) =>
  draft.shopAddressLine1 === draft.ownerAddressLine1 &&
  (draft.shopAddressLine2 || "") === (draft.ownerAddressLine2 || "") &&
  (draft.shopCity || "") === (draft.ownerCity || "") &&
  (draft.shopPincode || "") === (draft.ownerPincode || "");

const mapDraftToFormValues = (draft, baseValues) => {
  if (!draft?.applicationId) {
    return baseValues;
  }

  const mapped = {
    ...baseValues,
    applicationId: String(draft.applicationId),
    detailId:
  draft.detailId ??
  draft.detail?.id ??
  "",
    district:
      draft.districtId != null
        ? { id: draft.districtId, name: draft.districtName || "" }
        : null,
    shopName: draft.shopName || "",
    shopAddressLine1: draft.shopAddressLine1 || "",
    shopAddressLine2: draft.shopAddressLine2 || "",
    shopCity: draft.shopCity || "",
    shopPincode: draft.shopPincode || "",
    ownerName: draft.ownerName || baseValues.ownerName,
    ownerResidentialAddress: draft.ownerResidentialAddress || "",
    ownerAddressLine1: draft.ownerAddressLine1 || "",
    ownerAddressLine2: draft.ownerAddressLine2 || "",
    ownerCity: draft.ownerCity || "",
    ownerPincode: draft.ownerPincode || "",
    ownerOfficeAddress: draft.ownerOfficeAddress || "",
    contactLandline: draft.contactLandline || "",
    contactMobile: draft.contactMobile || baseValues.contactMobile,
    contactEmail: draft.contactEmail || baseValues.contactEmail,
    latitude: draft.latitude != null ? String(draft.latitude) : "",
    longitude: draft.longitude != null ? String(draft.longitude) : "",
    sameAsShop: isSameAsShop(draft),
  };

  return mapped;
};

const PetShopRegisterPage = () => {
  const user = getUserAttributes();
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState(buildInitialFormValues(user));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [documents, setDocuments] = useState({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getPetShopRegistrationDraft();
      if (cancelled) {
        return;
      }

      if (response?.isSuccess) {
        const draft =
          response.data?.payLoad ?? response.data?.payload ?? response.data;
          console.log("DRAFT RESPONSE", draft);
        if (draft?.applicationId) {
          setFormValues((current) => mapDraftToFormValues(draft, current));
          console.log("DRAFT OBJECT", draft);
console.log("DRAFT ID", draft.id);
console.log("DETAIL ID", draft.detailId);
console.log("DETAIL", draft.detail);
         const facilityResponse =
  await getPetShopFacility(
    draft.detailId ??
    draft.detail?.id
  );
  const animalResponse =
  await getPetShopProposedAnimals(
    draft.applicationId
  );
const declarationResponse =
  await getApplicationDeclaration(
    draft.applicationId
  );
  console.log(
  "DECLARATION RESPONSE FULL",
  JSON.stringify(
    declarationResponse,
    null,
    2
  )
);
  

console.log(
  "DECLARATION RESPONSE",
  declarationResponse
);

console.log(
  "ANIMAL DRAFT",
  animalResponse
);

if (animalResponse?.isSuccess) {

  const animalDraft =
    animalResponse.data?.payLoad ??
    animalResponse.data?.payload ??
    animalResponse.data;

  if (animalDraft) {

    const animalList =
      Array.isArray(animalDraft)
        ? animalDraft
        : animalDraft.content || [];

        console.log(
  "ANIMAL DRAFT RESPONSE",
  animalResponse
);

console.log(
  "ANIMAL PAYLOAD",
  animalList
);

    setAnimals(
      animalList.map((item) => ({
        id: item.id,
        species: item.species,
        breed: item.breed || "",
        quantity: item.quantity || "",
        ageDescription: item.ageDescription || "",
        priceOffered: item.priceOffered || "",
        description: item.description || "",
      }))
    );
  } else {
    setAnimals([{ id: "", species: "", breed: "", quantity: "", ageDescription: "", priceOffered: "", description: "" }]);
  }
}


console.log(
  "FACILITY RESPONSE",
  facilityResponse
);

if (facilityResponse?.isSuccess) {
  const facility =
    facilityResponse.data?.payLoad ??
    facilityResponse.data?.payload ??
    facilityResponse.data;

  console.log("FACILITY DATA", facility);

  setFacilityForm({
  id: facility.id || "",

  accommodationInfrastructure:
    facility.accommodationInfrastructure || "",

    openingTime:
      facility.workingHours
        ? facility.workingHours.split(" - ")[0]
        : "",

    closingTime:
      facility.workingHours
        ? facility.workingHours.split(" - ")[1]
        : "",

    restDay:
      facility.restDay
        ? facility.restDay.split(",")
        : [],

    ventilationArrangement:
      facility.ventilationArrangement || "",

    lightingArrangement:
      facility.lightingArrangement || "",

    fireSafetyArrangement:
      facility.fireSafetyArrangement || "",

    heatingCoolingArrangement:
      facility.heatingCoolingArrangement || "",

    powerBackupArrangement:
      facility.powerBackupArrangement || "",

    foodStorageArrangement:
      facility.foodStorageArrangement || "",

    cleanlinessWasteArrangement:
      facility.cleanlinessWasteArrangement || "",

    deadAnimalDisposalArrangement:
      facility.deadAnimalDisposalArrangement || "",

    veterinarySupportArrangement:
      facility.veterinarySupportArrangement || "",
  });
  if (declarationResponse?.isSuccess) {

  const declarationDraft =
    declarationResponse.data?.payLoad ??
    declarationResponse.data?.payload ??
    declarationResponse.data;
    console.log(
  "DECLARATION DRAFT FROM API",
  declarationDraft
);

console.log(
  "DECLARATION ID FROM API",
  declarationDraft?.id
);
console.log(
  "DECLARATION RESPONSE FULL",
  declarationResponse
);

console.log(
  "DECLARATION DRAFT",
  declarationDraft
);

console.log(
  "DECLARATION DRAFT ID",
  declarationDraft?.id
);
  console.log(
    "DECLARATION DRAFT",
    declarationDraft
  );

  if (declarationDraft) {

    setDeclaration({
       id:
    declarationDraft?.id
      ? String(declarationDraft.id)
      : "",

      declarationPlace:
        declarationDraft.declarationPlace || "",

      declarationDate:
        declarationDraft.declarationDate || "",

      informationAccurate:
        declarationDraft.informationAccurate || false,

      affidavitRule2018Ack:
        declarationDraft.affidavitRule2018Ack || false,

      affidavitAwbiRulesAck:
        declarationDraft.affidavitAwbiRulesAck || false,

      affidavitConditionsAck:
        declarationDraft.affidavitConditionsAck || false,

      affidavitCancellationAck:
        declarationDraft.affidavitCancellationAck || false,

      affidavitTruthAck:
        declarationDraft.affidavitTruthAck || false,

      affidavitDeponentName:
        declarationDraft.affidavitDeponentName || "",
    });
  }
}
console.log(
  "DECLARATION VALUES FROM DRAFT",
  {
    declarationPlace:
      draft.declarationPlace,

    declarationDate:
      draft.declarationDate,

    informationAccurate:
      draft.informationAccurate,

    affidavitRule2018Ack:
      draft.affidavitRule2018Ack,

    affidavitAwbiRulesAck:
      draft.affidavitAwbiRulesAck,

    affidavitConditionsAck:
      draft.affidavitConditionsAck,

    affidavitCancellationAck:
      draft.affidavitCancellationAck,

    affidavitTruthAck:
      draft.affidavitTruthAck,

    affidavitDeponentName:
      draft.affidavitDeponentName,
  }
);
console.log(
  "DECLARATION FROM DRAFT",
  draft
);
  console.log("LOADED FACILITY ID", facility.id);
}

          setDraftLoaded(true);
        }
      }
      } catch (error) {
        console.error("Draft loading error:", error);
      } finally {
        setIsLoadingDraft(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleFacilityChange = (event) => {
  setFacilityForm({
    ...facilityForm,
    [event.target.name]: event.target.value,
  });
};

  const handleDropDownChange = (_, value, name) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSameAsShop = (event) => {
    const checked = event.target.checked;
    setFormValues({
      ...formValues,
      sameAsShop: checked,
      ownerAddressLine1: checked ? formValues.shopAddressLine1 : "",
      ownerAddressLine2: checked ? formValues.shopAddressLine2 : "",
      ownerCity: checked ? formValues.shopCity : "",
      ownerPincode: checked ? formValues.shopPincode : "",
    });
  };

  const buildStep1Payload = () => ({
    applicationId: formValues.applicationId || null,
    districtId: formValues.district?.id ?? null,
    shopName: formValues.shopName,
    ownerName: formValues.ownerName,
    shopAddressLine1: formValues.shopAddressLine1,
    shopAddressLine2: formValues.shopAddressLine2,
    shopCity: formValues.shopCity,
    shopPincode: formValues.shopPincode,
    ownerResidentialAddress: formValues.ownerResidentialAddress,
    ownerAddressLine1: formValues.ownerAddressLine1,
    ownerAddressLine2: formValues.ownerAddressLine2,
    ownerCity: formValues.ownerCity,
    ownerPincode: formValues.ownerPincode,
    ownerOfficeAddress: formValues.ownerOfficeAddress,
    contactLandline: formValues.contactLandline,
    contactMobile: formValues.contactMobile,
    contactEmail: formValues.contactEmail,
    latitude: formValues.latitude ? Number(formValues.latitude) : null,
    longitude: formValues.longitude ? Number(formValues.longitude) : null,
  });
 const [facilityForm, setFacilityForm] = useState({
  id: "",
  accommodationInfrastructure: "",

  openingTime: "",
  closingTime: "",

  restDay: [],

  ventilationArrangement: "",
  lightingArrangement: "",
  fireSafetyArrangement: "",
  heatingCoolingArrangement: "",
  powerBackupArrangement: "",
  foodStorageArrangement: "",
  cleanlinessWasteArrangement: "",
  deadAnimalDisposalArrangement: "",
  veterinarySupportArrangement: "",
});

const [animals, setAnimals] = useState([
  {
    id: "",
    species: "",
    breed: "",
    quantity: "",
    ageDescription: "",
    priceOffered: "",
    description: "",
  },
]);

const [declaration, setDeclaration] = useState({
  id: "",
  declarationPlace: "",
  declarationDate: "",

  informationAccurate: false,

  affidavitRule2018Ack: false,
  affidavitAwbiRulesAck: false,
  affidavitConditionsAck: false,
  affidavitCancellationAck: false,
  affidavitTruthAck: false,

  affidavitDeponentName: "",
});

  const handleSaveStep1 = async () => {
    if (isSaving) return;
    try {
    setIsSaving(true);
    setErrors({});
    const response = await savePetShopRegistrationStep1(buildStep1Payload());
    console.log(
  "STEP1 PAYLOAD",
  response.data?.payLoad ??
  response.data?.payload ??
  response.data
);

    if (response.isSuccess) {
      const payload = response.data?.payLoad ?? response.data?.payload ?? response.data;
     setFormValues({
  ...formValues,
  applicationId: payload?.applicationId ?? formValues.applicationId, 
  detailId: payload?.detailId ??payload?.detail?.id ??formValues.detailId,
});
      setDraftLoaded(true);
      toast.success("Draft saved. Continue with the next sections.");
      setActiveStep(1);
      return;
    }

    const data = response.data ?? {};
    if (typeof data === "object") {
      setErrors(data);
    }
    toast.error("Could not save shop details");
    } catch (error) {
      console.error(error);
      toast.error("Could not save shop details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStep3 = async () => {
  if (isSaving) return;

  try {
    setIsSaving(true);

    for (let i = 0; i < animals.length; i++) {
      const animal = animals[i];
     
      const payload = {
        id: animal.id || null,
        application: {
          id: Number(formValues.applicationId),
        },
        recordKind: "PROPOSED",
        species: animal.species,
        breed: animal.breed,
        quantity: animal.quantity
          ? Number(animal.quantity)
          : null,
        ageDescription: animal.ageDescription,
        priceOffered: animal.priceOffered
          ? Number(animal.priceOffered)
          : null,
        description: animal.description,
        displayOrder: i,
      };
       console.log("STEP3 PAYLOAD", payload);
       console.log("ANIMAL ID", animal.id);
console.log("STEP3 PAYLOAD", payload);
      const response = animal.id
  ? await updatePetShopProposedAnimal(
      payload
    )
  : await savePetShopProposedAnimal(
      payload
    );

console.log("STEP3 RESPONSE", response);
      if (!response?.isSuccess) {
        toast.error(
          "Failed to save animals"
        );
        return;
      }
    }

    toast.success(
      "Animals saved successfully"
    );

    setActiveStep(3);

  } catch (error) {
    console.error(
      "Failed to save animals",
      error
    );

    toast.error(
      "Failed to save animals"
    );

  } finally {
    setIsSaving(false);
  }
};
const handleSaveStep4 = async () => {
  try {
    console.log(
  "DECLARATION STATE BEFORE SAVE",
  declaration
);

console.log(
  "DECLARATION ID BEFORE SAVE",
  declaration.id
);

    const payload = {
      applicationId: formValues.applicationId,
      ...declaration,
    };
console.log(
  "FORM APPLICATION ID",
  formValues.applicationId
);

console.log(
  "FORM APPLICATION ID TYPE",
  typeof formValues.applicationId
);

console.log(
  "DECLARATION OBJECT",
  declaration
);

console.log(
  "PAYLOAD APPLICATION ID",
  payload.applicationId
);

console.log(
  "PAYLOAD APPLICATION ID TYPE",
  typeof payload.applicationId
);
    console.log(
      "DECLARATION PAYLOAD",
      payload
    );

    let response;

    if (declaration.id) {

      response =
        await updateApplicationDeclaration(
          payload
        );

    } else {

      response =
        await saveApplicationDeclaration(
          payload
        );
    }

    if (response?.isSuccess) {

      const savedData =
        response.data?.payLoad ??
        response.data?.payload ??
        response.data;

      setDeclaration((prev) => ({
        ...prev,
        id: savedData?.id,
      }));

      toast.success(
        "Declaration saved successfully"
      );

      setActiveStep(4);}  } catch (error) {console.error(error);
toast.error(
      "Failed to save declaration"
    );
  }
};
 const handleSaveStep2 = async () => {
  if (isSaving) {
    return;
  }

  try {
    setIsSaving(true);
    setErrors({});

    const payload = {
      id: facilityForm.id || null,

      petShopDetailId: Number(
        formValues.detailId
      ),

      accommodationInfrastructure:
        facilityForm.accommodationInfrastructure,

      workingHours:
        facilityForm.openingTime &&
        facilityForm.closingTime
          ? `${facilityForm.openingTime} - ${facilityForm.closingTime}`
          : "",

      restDay: Array.isArray(
        facilityForm.restDay
      )
        ? facilityForm.restDay.join(",")
        : facilityForm.restDay || "",

      ventilationArrangement:
        facilityForm.ventilationArrangement,

      lightingArrangement:
        facilityForm.lightingArrangement,

      fireSafetyArrangement:
        facilityForm.fireSafetyArrangement,

      heatingCoolingArrangement:
        facilityForm.heatingCoolingArrangement,

      powerBackupArrangement:
        facilityForm.powerBackupArrangement,

      foodStorageArrangement:
        facilityForm.foodStorageArrangement,

      cleanlinessWasteArrangement:
        facilityForm.cleanlinessWasteArrangement,

      deadAnimalDisposalArrangement:
        facilityForm.deadAnimalDisposalArrangement,

      veterinarySupportArrangement:
        facilityForm.veterinarySupportArrangement,
    };

    let response;

    if (facilityForm.id) {
      response =
        await updatePetShopRegistrationStep2(
          payload
        );
    } else {
      response =
        await savePetShopRegistrationStep2(
          payload
        );
    }

    if (response?.isSuccess) {
      toast.success(
        "Facility details saved"
      );

      setActiveStep(2);
      return;
    }

    toast.error(
      "Failed to save facility details"
    );
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to save facility details"
    );
  } finally {
    setIsSaving(false);
  }
};

  if (isLoadingDraft) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 240,
        }}
      >
        <CircularProgress size={32} sx={{ color: "#2563eb" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: "#1e3a8a" }}>
        Pet Shop Registration (FORM-1)
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
    <Step1ShopOwner
      formValues={formValues}
      errors={errors}
      onChange={handleChange}
      onDropDownChange={handleDropDownChange}
      onSameAsShop={handleSameAsShop}
    />
  )}

  {activeStep === 1 && (
    <Step2FacilityInfrastructure
      formValues={facilityForm}
      errors={errors}
      onChange={handleFacilityChange}
    />
  )}

  {activeStep === 2 && (
  <Step3ProposedAnimals
    animals={animals}
    setAnimals={setAnimals}
  />
)}

{activeStep === 3 && (
  <Step4DeclarationAffidavit
    declaration={declaration}
    setDeclaration={setDeclaration}
  />
)}
{activeStep === 4 && (
  <Step5Documents
  formValues={formValues}
  facilityForm={facilityForm}
  animals={animals}
  declaration={declaration}
  documents={documents}
  setDocuments={setDocuments}
  setActiveStep={setActiveStep}
/>
)}
{activeStep === 5 && (
  <Step6PaymentSubmit
  applicationId={formValues?.applicationId}
/>
)}

          <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    gap: 1,
    mt: 3,
  }}
>
  <Box>
    {activeStep > 0 && (
      <Button
        variant="outlined"
        onClick={() => setActiveStep((s) => s - 1)}
      >
        Back
      </Button>
    )}
  </Box>

  <Box sx={{ display: "flex", gap: 1 }}>
    {activeStep === 0 && (
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={handleSaveStep1}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save & Continue"}
      </Button>
    )}

    {activeStep === 1 && (
      <>
        <Button
          variant="outlined"
          onClick={() => setActiveStep(2)}
        >
          Preview Next Step
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveStep2}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save & Continue"}
        </Button>
      </>
    )}
    {activeStep === 2 && (
  <Button
    variant="contained"
    startIcon={<SaveIcon />}
    onClick={handleSaveStep3}
    disabled={isSaving}
  >
    {isSaving ? "Saving..." : "Save & Continue"}
  </Button>
)}
{activeStep === 3 && (
  <Button
    variant="contained"
    startIcon={<SaveIcon />}
    onClick={handleSaveStep4}
  >
    Save & Continue
  </Button>
)}
  </Box>
</Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PetShopRegisterPage;
