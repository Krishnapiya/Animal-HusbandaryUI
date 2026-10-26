import { useEffect, useState } from "react";
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
import { toast } from "material-react-toastify";

import WizardStepper from "./WizardStepper";
import Step1BreederDetails from "./Step1BreederDetails";
import Step2FacilityInfrastructure from "./Step2FacilityInfrastructure";
import Step3DogBreedDetails from "./Step3DogBreedDetails";
import Step4Declaration from "./Step4Declaration";
import Step5Documents, {
  dogBreederDocumentList,
} from "./Step5Documents";
import Step6Preview from "./Step6Preview";

import {
  getDogBreederRegistrationDraft,
  saveDogBreederDetail,
} from "../../api-client/dogBreederRegistration";
import { saveDogBreederFacility } from "../../api-client/dogBreederFacility";
import { saveDogBreederBreed } from "../../api-client/dogBreederBreed";
import { saveDogBreederDeclaration } from "../../api-client/dogBreederDeclaration";
import {
  uploadApplicationDocument,
  getApplicationDocumentsByApplicationId,
} from "../../api-client/applicationDocument";
import { getUserAttributes } from "../../utils";
import { submitDogBreederApplication } from "../../api-client/dogBreederRegistration";
const initialStep1 = {
  id: "",
  applicationId: "",
  district: null,
  breederName: "",
  panNumber: "",
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

  ventilationAvailable: false,
  lightingAvailable: false,
  heatingCoolingAvailable: false,
  foodStorageAvailable: false,
  cleanlinessWasteAvailable: false,
  deadAnimalDisposalAvailable: false,
  veterinarySupportAvailable: false,

  accommodationInfrastructure: "",
  workingHours: "",
  openingTime: "",
  closingTime: "",
  holiday: [],
  restDay: [],

  ventilationArrangement: "",
  lightingArrangement: "",
  heatingCoolingArrangement: "",
  foodStorageArrangement: "",
  cleanlinessWasteArrangement: "",
  deadAnimalDisposalArrangement: "",
  veterinarySupportArrangement: "",

  cageEnclosureDetails: "",
};

const initialBreedItem = {
  id: "",
  speciesId: null,
  species: null,
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
  displayOrder: 0,
};

const initialStep3 = {
  id: "",
  dogBreederDetailId: "",
  breedName: "",
  gender: "",
  dogCount: "",
  ageDescription: "",
  breedsList: [initialBreedItem],
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

const getUserKey = (user) =>
  user?.username || user?.email || user?.id || user?.userId || "guest";

const getUserNumericId = (user) =>
  toValidNumber(user?.id) ||
  toValidNumber(user?.userId) ||
  toValidNumber(user?.user_id) ||
  toValidNumber(user?.userid);

const getInitialDeclarationValues = (user) => ({
  ...initialStep4,
  applicantName:
    user?.fname && user?.lname ? `${user.fname} ${user.lname}`.trim() : "",
  signatureName:
    user?.fname && user?.lname ? `${user.fname} ${user.lname}`.trim() : "",
});

const getFirstItem = (value) => {
  if (Array.isArray(value)) {
    return value[0] || {};
  }

  return value || {};
};

const getDraftDetail = (draft) =>
  draft?.dogBreederDetail ||
  draft?.dogBreederDetailDto ||
  draft?.dogBreederDetailDTO ||
  draft?.breederDetail ||
  draft?.detail ||
  draft ||
  {};

const getDraftFacility = (draft) =>
  draft?.dogBreederFacility ||
  draft?.dogBreederFacilityDto ||
  draft?.facility ||
  draft?.facilityDetails ||
  draft?.facilityInfrastructure ||
  {};

const getDraftBreed = (draft) =>
  getFirstItem(
    draft?.dogBreederBreeds ||
      draft?.dogBreederBreedList ||
      draft?.breedDetails ||
      draft?.breeds ||
      draft?.dogBreedDetails ||
      draft?.dogBreederBreed
  );

const getDraftDeclaration = (draft) =>
  draft?.dogBreederDeclaration ||
  draft?.dogBreederDeclarationDto ||
  draft?.declaration ||
  draft?.declarationDetails ||
  {};

const getDraftDocuments = (draft) => {
  if (Array.isArray(draft)) {
    return draft;
  }

  return (
    draft?.documents ||
    draft?.documentDetails ||
    draft?.applicationDocuments ||
    draft?.applicationDocumentList ||
    draft?.payLoad ||
    draft?.payload ||
    draft?.content ||
    draft?.data ||
    []
  );
};

const getSavedDocumentId = (document) => {
  return (
    document?.id ||
    document?.documentId ||
    document?.applicationDocumentId ||
    document?.application_document_id ||
    document?.applicationDocument?.id ||
    document?.payLoad?.id ||
    document?.payload?.id ||
    ""
  );
};

const getDocumentArray = (value) => {
  const payload = getResponsePayload(value) ?? value;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  if (Array.isArray(payload?.documents)) {
    return payload.documents;
  }

  if (Array.isArray(payload?.applicationDocuments)) {
    return payload.applicationDocuments;
  }

  if (Array.isArray(payload?.applicationDocumentList)) {
    return payload.applicationDocumentList;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const buildSavedDocuments = (documents) => {
  const savedDocuments = {};

  if (!Array.isArray(documents)) {
    return savedDocuments;
  }

  documents.forEach((document) => {
    const documentTypeId =
      document?.documentTypeId ||
      document?.document_type_id ||
      document?.documentType?.id ||
      document?.documentType?.value ||
      document?.documentTypeDto?.id ||
      document?.documentTypeDTO?.id ||
      document?.typeId ||
      document?.type?.id;

    if (!documentTypeId) {
      return;
    }

    const savedDocumentId = getSavedDocumentId(document);

    const currentDocument = savedDocuments[documentTypeId];

    const currentId = Number(currentDocument?.id || 0);
    const newId = Number(savedDocumentId || 0);

    const currentUploadedAt = currentDocument?.uploadedAt
      ? new Date(currentDocument.uploadedAt).getTime()
      : 0;

    const newUploadedAt = document?.uploadedAt
      ? new Date(document.uploadedAt).getTime()
      : 0;

    const shouldReplace =
      !currentDocument ||
      newUploadedAt > currentUploadedAt ||
      newId > currentId;

    if (shouldReplace) {
      savedDocuments[documentTypeId] = {
        id: savedDocumentId,
        documentId: savedDocumentId,
        applicationDocumentId: savedDocumentId,
        documentTypeId: Number(documentTypeId),
        name: document?.fileName || document?.name || "",
        fileName: document?.fileName || document?.name || "",
        type: document?.mimeType || document?.type || "",
        mimeType: document?.mimeType || document?.type || "",
        size: document?.fileSizeBytes || document?.size || 0,
        fileSizeBytes: document?.fileSizeBytes || document?.size || 0,
        filePath: document?.filePath || "",
        uploadedAt: document?.uploadedAt || "",
        saved: true,
        changed: false,
        file: null,
      };
    }
  });

  return savedDocuments;
};

const buildDistrictFromDraft = (detail) => {
  const district =
    detail?.district || detail?.districtDto || detail?.districtDTO;

  const districtId = detail?.districtId || district?.id;

  if (!districtId) {
    return null;
  }

  return {
    ...district,
    id: districtId,
    name:
      district?.name ||
      district?.districtName ||
      detail?.districtName ||
      String(districtId),
  };
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
    payload?.id,
    payload?.dog_breeder_detail_id,
    payload?.dogBreederDetail?.id,
    payload?.dogBreederDetailDto?.id,
    payload?.dogBreederDetailDTO?.id,
    payload?.breederDetail?.id,
    payload?.breederDetailId,
    payload?.detail?.id,
    payload?.detailId,

    contentFirst?.dogBreederDetailId,
    contentFirst?.id,
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

  const detail =
    payload?.dogBreederDetail ||
    payload?.dogBreederDetailDto ||
    payload?.dogBreederDetailDTO ||
    payload?.breederDetail ||
    payload?.detail ||
    {};

  const contentFirst = Array.isArray(payload?.content)
    ? payload.content[0]
    : null;

  const candidates = [
    payload?.applicationId,
    payload?.application_id,
    payload?.application?.id,
    payload?.registrationApplicationId,
    payload?.registration_application_id,
    payload?.registrationApplication?.id,

    detail?.applicationId,
    detail?.application_id,
    detail?.application?.id,
    detail?.registrationApplicationId,
    detail?.registration_application_id,
    detail?.registrationApplication?.id,

    contentFirst?.applicationId,
    contentFirst?.application_id,
    contentFirst?.application?.id,
    contentFirst?.registrationApplicationId,
    contentFirst?.registration_application_id,
    contentFirst?.registrationApplication?.id,
  ];

  for (const candidate of candidates) {
    const validId = toValidNumber(candidate);

    if (validId) {
      return validId;
    }
  }

  return "";
};

const normalizeWizardStep = (step) => {
  const numberValue = Number(step);

  return Number.isFinite(numberValue)
    ? Math.min(Math.max(numberValue, 0), 6)
    : 0;
};

const getDraftCurrentStep = (draft) => {
  const detail = getDraftDetail(draft);
  const facility = getDraftFacility(draft);
  const breed = getDraftBreed(draft);
  const declaration = getDraftDeclaration(draft);
  const documents = getDraftDocuments(draft);

  if (documents?.length) {
    return 5;
  }

  if (
    declaration?.id ||
    declaration?.qualificationExperience ||
    declaration?.declarationPlace
  ) {
    return 4;
  }

  if (breed?.id || breed?.breedName) {
    return 3;
  }

  if (
    facility?.id ||
    facility?.accommodationInfrastructure ||
    facility?.workingHours
  ) {
    return 2;
  }

  if (detail?.id || extractDogBreederDetailId(draft)) {
    return 1;
  }

  return 0;
};

const DogBreederRegisterPage = () => {
  const user = getUserAttributes();
  const userKey = getUserKey(user);

  const [activeStep, setActiveStep] = useState(0);

  const [formValues, setFormValues] = useState(() =>
    buildInitialFormValues(user)
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const [facilityValues, setFacilityValues] = useState(initialStep2);
  const [facilityErrors, setFacilityErrors] = useState({});
  const [isSavingFacility, setIsSavingFacility] = useState(false);

  const [breedValues, setBreedValues] = useState(initialStep3);
  const [breedErrors, setBreedErrors] = useState({});
  const [isSavingBreed, setIsSavingBreed] = useState(false);

  const [declarationValues, setDeclarationValues] = useState(() =>
    getInitialDeclarationValues(user)
  );
  const [declarationErrors, setDeclarationErrors] = useState({});
  const [isSavingDeclaration, setIsSavingDeclaration] = useState(false);

  const [documentValues, setDocumentValues] = useState({});
  const [documentErrors, setDocumentErrors] = useState({});
  const [isSavingDocument, setIsSavingDocument] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewValues, setPreviewValues] = useState(null);

  const goToStep = (stepIndex) => {
    setActiveStep(normalizeWizardStep(stepIndex));
  };

  useEffect(() => {
    let isMounted = true;

    const resetToStep1 = () => {
      setActiveStep(0);
      setFormValues(buildInitialFormValues(user));
      setFacilityValues(initialStep2);
      setBreedValues(initialStep3);
      setDeclarationValues(getInitialDeclarationValues(user));
      setDocumentValues({});
      setPreviewValues(null);
      setDraftLoaded(false);

      setErrors({});
      setFacilityErrors({});
      setBreedErrors({});
      setDeclarationErrors({});
      setDocumentErrors({});
    };

    const loadSavedDraft = async () => {
      try {
        const draftResponse = await getDogBreederRegistrationDraft();
        const draftPayload = getResponsePayload(draftResponse);

        if (!isMounted) {
          return;
        }

        if (!draftPayload) {
          resetToStep1();
          return;
        }

        const detail = getDraftDetail(draftPayload);
        const facility = getDraftFacility(draftPayload);
        const breed = getDraftBreed(draftPayload);
        const declaration = getDraftDeclaration(draftPayload);
        const documents = getDraftDocuments(draftPayload);

        const dogBreederDetailId =
          extractDogBreederDetailId(draftPayload) || toValidNumber(detail?.id);

        const applicationId = extractApplicationId(draftPayload);

        console.log("DOG BREEDER DRAFT LOADED", {
          userKey,
          applicationId,
          dogBreederDetailId,
          draftPayload,
        });

        if (!dogBreederDetailId && !applicationId) {
          resetToStep1();
          return;
        }

        setFormValues((prev) => ({
          ...prev,
          id: dogBreederDetailId || prev.id,
          applicationId: applicationId || "",
          district: buildDistrictFromDraft(detail) || prev.district,
          breederName: detail?.breederName || prev.breederName,
          panNumber: detail?.panNumber || prev.panNumber || "",
          addressLine1: detail?.addressLine1 || prev.addressLine1,
          addressLine2: detail?.addressLine2 || prev.addressLine2,
          city: detail?.city || prev.city,
          pincode: detail?.pincode || prev.pincode,
          contactMobile: detail?.contactMobile || prev.contactMobile,
          contactEmail: detail?.contactEmail || prev.contactEmail,
          facilityDetails: detail?.facilityDetails || prev.facilityDetails,
          totalDogsCount: detail?.totalDogsCount ?? prev.totalDogsCount,
        }));

setFacilityValues((prev) => ({
  ...prev,
  id: facility?.id || prev.id,
  dogBreederDetailId:
    dogBreederDetailId ||
    facility?.dogBreederDetailId ||
    facility?.dogBreederDetail?.id ||
    prev.dogBreederDetailId,

  ventilationAvailable:
    facility?.ventilationAvailable ?? prev.ventilationAvailable,

  lightingAvailable:
    facility?.lightingAvailable ?? prev.lightingAvailable,

  heatingCoolingAvailable:
    facility?.heatingCoolingAvailable ??
    prev.heatingCoolingAvailable,

  foodStorageAvailable:
    facility?.foodStorageAvailable ??
    prev.foodStorageAvailable,

  cleanlinessWasteAvailable:
    facility?.cleanlinessWasteAvailable ??
    prev.cleanlinessWasteAvailable,

  deadAnimalDisposalAvailable:
    facility?.deadAnimalDisposalAvailable ??
    prev.deadAnimalDisposalAvailable,

  veterinarySupportAvailable:
    facility?.veterinarySupportAvailable ??
    prev.veterinarySupportAvailable,

  accommodationInfrastructure:
    facility?.accommodationInfrastructure ||
    prev.accommodationInfrastructure,

  workingHours:
    facility?.workingHours || prev.workingHours || "",

  openingTime:
    (facility?.workingHours && facility.workingHours.includes(" - "))
      ? facility.workingHours.split(" - ")[0]
      : facility?.openingTime || prev.openingTime || "",

  closingTime:
    (facility?.workingHours && facility.workingHours.includes(" - "))
      ? facility.workingHours.split(" - ")[1]
      : facility?.closingTime || prev.closingTime || "",

  holiday:
    Array.isArray(facility?.holiday)
      ? facility.holiday
      : facility?.holiday
      ? String(facility.holiday).split(",").map((d) => d.trim()).filter(Boolean)
      : Array.isArray(facility?.restDay)
      ? facility.restDay
      : facility?.restDay
      ? String(facility.restDay).split(",").map((d) => d.trim()).filter(Boolean)
      : Array.isArray(prev.holiday)
      ? prev.holiday
      : [],

  restDay:
    Array.isArray(facility?.holiday)
      ? facility.holiday
      : facility?.holiday
      ? String(facility.holiday).split(",").map((d) => d.trim()).filter(Boolean)
      : Array.isArray(facility?.restDay)
      ? facility.restDay
      : facility?.restDay
      ? String(facility.restDay).split(",").map((d) => d.trim()).filter(Boolean)
      : Array.isArray(prev.holiday)
      ? prev.holiday
      : [],

  ventilationArrangement:
    facility?.ventilationArrangement ||
    prev.ventilationArrangement,

  lightingArrangement:
    facility?.lightingArrangement ||
    prev.lightingArrangement,

  heatingCoolingArrangement:
    facility?.heatingCoolingArrangement ||
    prev.heatingCoolingArrangement,

  foodStorageArrangement:
    facility?.foodStorageArrangement ||
    prev.foodStorageArrangement,

  cleanlinessWasteArrangement:
    facility?.cleanlinessWasteArrangement ||
    prev.cleanlinessWasteArrangement,

  deadAnimalDisposalArrangement:
    facility?.deadAnimalDisposalArrangement ||
    prev.deadAnimalDisposalArrangement,

  veterinarySupportArrangement:
    facility?.veterinarySupportArrangement ||
    prev.veterinarySupportArrangement,

  cageEnclosureDetails:
    facility?.cageEnclosureDetails ||
    prev.cageEnclosureDetails,
}));

        const rawBreeds =
          draftPayload?.dogBreederBreeds ||
          draftPayload?.dogBreederBreedList ||
          draftPayload?.breedDetails ||
          draftPayload?.breeds ||
          draftPayload?.dogBreedDetails ||
          (draftPayload?.dogBreederBreed ? [draftPayload.dogBreederBreed] : []);

        const loadedBreeds = (Array.isArray(rawBreeds) && rawBreeds.length > 0)
          ? rawBreeds.map((b, i) => {
              const specId = b.species?.id ?? b.speciesId ?? null;
              const isOtherBrd = Boolean(b.customBreedName && String(b.customBreedName).trim() !== "");

              return {
                id: b.id || "",
                dogBreederDetailId:
                  b.dogBreederDetailId ||
                  b.dogBreederDetail?.id ||
                  dogBreederDetailId ||
                  "",
                species: b.species || null,
                speciesId: specId,
                customSpeciesName: b.customSpeciesName || "",
                breed: isOtherBrd ? "Other" : (b.breed || b.breedName || ""),
                breedId: isOtherBrd ? "OTHER" : (b.breedId || ""),
                breedObject: null,
                customBreedName: b.customBreedName || "",
                breedName: b.breedName || "",
                gender: b.gender || "",
                dogCount: b.dogCount ?? "",
                ageDescription: b.ageDescription || "",
                priceOffered: b.priceOffered ?? "",
                description: b.description || "",
                displayOrder: b.displayOrder ?? i,
              };
            })
          : [initialBreedItem];

        setBreedValues((prev) => ({
          ...prev,
          id: loadedBreeds[0]?.id || breed?.id || prev.id,
          dogBreederDetailId:
            dogBreederDetailId ||
            loadedBreeds[0]?.dogBreederDetailId ||
            breed?.dogBreederDetailId ||
            breed?.dogBreederDetail?.id ||
            prev.dogBreederDetailId,
          breedName: loadedBreeds[0]?.breedName || breed?.breedName || prev.breedName,
          gender: loadedBreeds[0]?.gender || breed?.gender || prev.gender,
          dogCount: loadedBreeds[0]?.dogCount ?? breed?.dogCount ?? prev.dogCount,
          ageDescription:
            loadedBreeds[0]?.ageDescription || breed?.ageDescription || prev.ageDescription,
          priceOffered: loadedBreeds[0]?.priceOffered ?? breed?.priceOffered ?? "",
          description: loadedBreeds[0]?.description || breed?.description || "",
          breedsList: loadedBreeds,
        }));

        setDeclarationValues((prev) => ({
          ...prev,
          id: declaration?.id || prev.id,
          dogBreederDetailId:
            dogBreederDetailId ||
            declaration?.dogBreederDetailId ||
            declaration?.dogBreederDetail?.id ||
            prev.dogBreederDetailId,
          qualificationExperience:
            declaration?.qualificationExperience ||
            prev.qualificationExperience,
          declarationAccepted:
            declaration?.declarationAccepted ?? prev.declarationAccepted,
          declarationPlace:
            declaration?.declarationPlace || prev.declarationPlace,
          declarationDate:
            declaration?.declarationDate || prev.declarationDate,
          applicantName:
            declaration?.applicantName ||
            detail?.breederName ||
            prev.applicantName,
          signatureName:
            declaration?.signatureName ||
            detail?.breederName ||
            prev.signatureName,
          signedAt: declaration?.signedAt || prev.signedAt,
        }));

        let savedDocumentList = getDocumentArray(documents);

        if ((!savedDocumentList || savedDocumentList.length === 0) && applicationId) {
          try {
            const documentResponse =
              await getApplicationDocumentsByApplicationId(applicationId);

            savedDocumentList = getDocumentArray(documentResponse);
          } catch (error) {
            console.error("APPLICATION DOCUMENT LOAD ERROR", error);
          }
        }

        const savedDocuments = buildSavedDocuments(savedDocumentList);
        const hasSavedDocuments = Object.keys(savedDocuments).length > 0;

        setDocumentValues(hasSavedDocuments ? savedDocuments : {});
        setDraftLoaded(true);

        const backendCurrentStep =
          toValidNumber(draftPayload?.currentStep) ||
          toValidNumber(draftPayload?.application?.currentStep) ||
          toValidNumber(draftPayload?.registrationApplication?.currentStep);

        const draftStep = getDraftCurrentStep(draftPayload);
        const documentStep = hasSavedDocuments ? 5 : 0;

        const nextStep = Math.max(
          backendCurrentStep || 0,
          draftStep || 0,
          documentStep
        );

        goToStep(nextStep);
      } catch (error) {
        console.error("DOG BREEDER DRAFT LOAD ERROR", error);

        if (isMounted) {
          resetToStep1();
        }
      }
    };

    loadSavedDraft();

    return () => {
      isMounted = false;
    };
  }, [userKey]);

const handlePreviewClick = () => {
  const selectedDocuments = Object.entries(documentValues).map(
    ([documentTypeId, file]) => {
      const document = dogBreederDocumentList.find(
        (item) => item.id === Number(documentTypeId)
      );

      const selectedFile =
        file?.file instanceof File
          ? file.file
          : file instanceof File
          ? file
          : null;

      const savedDocumentId = getSavedDocumentId(file);

      return {
        ...(file || {}),

        id: savedDocumentId,
        documentId: savedDocumentId,
        applicationDocumentId: savedDocumentId,

        documentTypeId: Number(documentTypeId),
        documentTypeName: document?.name || file?.documentTypeName || "",
        documentName: document?.name || file?.documentName || "",

        file: selectedFile,
        fileName:
          file?.fileName ||
          file?.name ||
          selectedFile?.name ||
          "",
        mimeType:
          file?.mimeType ||
          file?.type ||
          selectedFile?.type ||
          "",
        fileSizeBytes:
          file?.fileSizeBytes ||
          file?.size ||
          selectedFile?.size ||
          "",
        filePath: file?.filePath || "",
        saved: file?.saved || false,
        changed: file?.changed || false,
      };
    }
  );

  setPreviewValues({
    breederDetails: formValues,
    facilityDetails: {
      ...facilityValues,
      workingHours:
        facilityValues.workingHours ||
        (facilityValues.openingTime && facilityValues.closingTime
          ? `${facilityValues.openingTime} - ${facilityValues.closingTime}`
          : ""),
      holiday: facilityValues.holiday,
      restDay: facilityValues.holiday,
    },
    breedDetails:
      Array.isArray(breedValues?.breedsList) && breedValues.breedsList.length > 0
        ? breedValues.breedsList.map((item) => {
            const isOtherSpec =
              Number(item.speciesId) === 24 ||
              (item.species?.speciesName || item.species?.name || "").toLowerCase() ===
                "other";
            const isOtherBrd =
              item.breedId === "OTHER" ||
              (typeof item.breed === "string" &&
                item.breed.toLowerCase() === "other") ||
              Boolean(
                item.customBreedName && String(item.customBreedName).trim() !== ""
              );

            let displayName = "";
            if (isOtherSpec) {
              const spec = (item.customSpeciesName || "Other").trim();
              const brd = (item.customBreedName || item.breed || "").trim();
              displayName = brd ? `${spec} - ${brd}` : spec;
            } else if (isOtherBrd) {
              displayName = (item.customBreedName || "Other").trim();
            } else {
              displayName = (item.breed || item.breedName || "").trim();
            }

            return {
              ...item,
              breedName: displayName,
            };
          })
        : breedValues?.breedName
        ? [breedValues]
        : [],
    declarationDetails: declarationValues,
    documentDetails: selectedDocuments,

    // important for Step6Preview signature image
    documents: documentValues,
  });
};
  const handleChange = (event) => {
    const { name, value } = event.target;
    const finalValue =
      name === "panNumber" ? (value || "").toUpperCase().slice(0, 10) : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
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

    const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const pan = (formValues.panNumber || "").trim().toUpperCase();
    if (!pan) {
      newErrors.panNumber = "PAN Card Number is required";
    } else if (!PAN_REGEX.test(pan)) {
      newErrors.panNumber = "Invalid PAN Card Number format (e.g. ABCDE1234F)";
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
    panNumber: formValues.panNumber
      ? formValues.panNumber.trim().toUpperCase()
      : "",
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

      if (!savedDogBreederDetailId || !savedApplicationId) {
        const draftResponse = await getDogBreederRegistrationDraft();
        const draftPayload = getResponsePayload(draftResponse);

        savedDogBreederDetailId =
          savedDogBreederDetailId || extractDogBreederDetailId(draftPayload);

        savedApplicationId =
          savedApplicationId || extractApplicationId(draftPayload);
      }

      console.log("STEP 1 SAVED IDS", {
        savedDogBreederDetailId,
        savedApplicationId,
        payload,
      });

      if (!savedDogBreederDetailId) {
        toast.error(
          "Dog breeder detail ID missing. Please check Step 1 API response."
        );
        return;
      }

      if (!savedApplicationId) {
        toast.error(
          "Application ID missing. Please check draft API / Step 1 API response."
        );
        return;
      }

      setFormValues((prev) => ({
        ...prev,
        id: savedDogBreederDetailId,
        applicationId: savedApplicationId,
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

      setDocumentValues({});
      setDocumentErrors({});
      setDraftLoaded(true);
      setPreviewValues(null);

      toast.success("Draft saved. Continue with the next sections.");
      goToStep(1);
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
    const { name, value } = event.target;

    setFacilityValues((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "openingTime" || name === "closingTime") {
        const op =
          name === "openingTime"
            ? value
            : prev.openingTime ||
              (prev.workingHours && prev.workingHours.includes(" - ")
                ? prev.workingHours.split(" - ")[0]
                : "");
        const cl =
          name === "closingTime"
            ? value
            : prev.closingTime ||
              (prev.workingHours && prev.workingHours.includes(" - ")
                ? prev.workingHours.split(" - ")[1]
                : "");
        updated.openingTime = op;
        updated.closingTime = cl;
        updated.workingHours = op && cl ? `${op} - ${cl}` : op || cl || "";
      }

      if (name === "holiday") {
        updated.holiday = value;
        updated.restDay = value;
      }

      return updated;
    });

    setFacilityErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "openingTime" || name === "closingTime"
        ? { workingHours: "" }
        : {}),
    }));
  };

  const validateFacility = () => {
    const newErrors = {};

    if (!facilityValues.accommodationInfrastructure?.trim()) {
      newErrors.accommodationInfrastructure =
        "Accommodation infrastructure is required";
    }

    const hasWorkingHours =
      (facilityValues.openingTime && facilityValues.closingTime) ||
      (facilityValues.workingHours && facilityValues.workingHours.trim());

    if (!hasWorkingHours) {
      if (!facilityValues.openingTime) {
        newErrors.openingTime = "Opening time is required";
      }
      if (!facilityValues.closingTime) {
        newErrors.closingTime = "Closing time is required";
      }
      newErrors.workingHours = "Working hours is required";
    }

    const hasHoliday =
      (Array.isArray(facilityValues.holiday) &&
        facilityValues.holiday.length > 0) ||
      (typeof facilityValues.holiday === "string" &&
        facilityValues.holiday.trim() !== "") ||
      (Array.isArray(facilityValues.restDay) &&
        facilityValues.restDay.length > 0) ||
      (typeof facilityValues.restDay === "string" &&
        facilityValues.restDay.trim() !== "");

    if (!hasHoliday) {
      newErrors.holiday = "Holiday is required";
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

      const resolvedWorkingHours =
        facilityValues.openingTime && facilityValues.closingTime
          ? `${facilityValues.openingTime} - ${facilityValues.closingTime}`
          : facilityValues.workingHours || "";

      const resolvedHoliday = Array.isArray(facilityValues.holiday)
        ? facilityValues.holiday.join(",")
        : Array.isArray(facilityValues.restDay)
        ? facilityValues.restDay.join(",")
        : facilityValues.holiday || facilityValues.restDay || "";

      const payload = {
        id: facilityValues.id || null,
        dogBreederDetailId,

        ventilationAvailable: facilityValues.ventilationAvailable,
        lightingAvailable: facilityValues.lightingAvailable,
        heatingCoolingAvailable: facilityValues.heatingCoolingAvailable,
        foodStorageAvailable: facilityValues.foodStorageAvailable,
        cleanlinessWasteAvailable: facilityValues.cleanlinessWasteAvailable,
        deadAnimalDisposalAvailable:
            facilityValues.deadAnimalDisposalAvailable,
        veterinarySupportAvailable:
            facilityValues.veterinarySupportAvailable,

        accommodationInfrastructure:
            facilityValues.accommodationInfrastructure,

        workingHours: resolvedWorkingHours,
        holiday: resolvedHoliday,

        ventilationArrangement:
            facilityValues.ventilationArrangement,
        lightingArrangement:
            facilityValues.lightingArrangement,
        heatingCoolingArrangement:
            facilityValues.heatingCoolingArrangement,
        foodStorageArrangement:
            facilityValues.foodStorageArrangement,
        cleanlinessWasteArrangement:
            facilityValues.cleanlinessWasteArrangement,
        deadAnimalDisposalArrangement:
            facilityValues.deadAnimalDisposalArrangement,
        veterinarySupportArrangement:
            facilityValues.veterinarySupportArrangement,
        cageEnclosureDetails:
            facilityValues.cageEnclosureDetails,
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
        workingHours: resolvedWorkingHours,
        openingTime:
          facilityValues.openingTime ||
          (resolvedWorkingHours.includes(" - ")
            ? resolvedWorkingHours.split(" - ")[0]
            : ""),
        closingTime:
          facilityValues.closingTime ||
          (resolvedWorkingHours.includes(" - ")
            ? resolvedWorkingHours.split(" - ")[1]
            : ""),
        holiday: Array.isArray(facilityValues.holiday)
          ? facilityValues.holiday
          : resolvedHoliday
          ? resolvedHoliday.split(",").map((d) => d.trim()).filter(Boolean)
          : [],
        restDay: Array.isArray(facilityValues.holiday)
          ? facilityValues.holiday
          : resolvedHoliday
          ? resolvedHoliday.split(",").map((d) => d.trim()).filter(Boolean)
          : [],
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
      goToStep(2);
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
    const list =
      Array.isArray(breedValues?.breedsList) &&
      breedValues.breedsList.length > 0
        ? breedValues.breedsList
        : [breedValues];

    const listErrors = {};
    let hasError = false;
    const seenBreedNames = new Set();

    list.forEach((item, idx) => {
      const itemErrors = {};

      // 1. Validate Species
      const specId =
        item?.species?.id ??
        item?.speciesId ??
        (typeof item?.species === "number"
          ? item.species
          : item?.species != null &&
            !isNaN(Number(item.species)) &&
            String(item.species).trim() !== ""
          ? Number(item.species)
          : null);

      const specName =
        item?.species?.speciesName ||
        item?.species?.name ||
        (typeof item?.species === "string" ? item.species : "");

      const isOtherSpecies =
        specId === 24 ||
        (specName && specName.toLowerCase() === "other") ||
        (item?.speciesId != null && Number(item.speciesId) === 24);

      if (specId == null && !item?.breedName && !item?.breed) {
        itemErrors.speciesId = "Animal species is required";
      }

      if (isOtherSpecies) {
        if (!item?.customSpeciesName || !item.customSpeciesName.trim()) {
          itemErrors.customSpeciesName = "Custom species name is required";
        } else if (item.customSpeciesName.trim().length > 120) {
          itemErrors.customSpeciesName =
            "Custom species name must not exceed 120 characters";
        }
      }

      // 2. Validate Breed
      const isOtherBreed =
        item?.breedId === "OTHER" ||
        item?.breed === "Other" ||
        (typeof item?.breed === "string" &&
          item.breed.toLowerCase() === "other") ||
        Boolean(
          item?.customBreedName && String(item.customBreedName).trim() !== ""
        );

      const hasBreed =
        item?.breedId != null && item.breedId !== ""
          ? true
          : Boolean(item?.breed && String(item.breed).trim() !== "") ||
            Boolean(item?.breedName && String(item.breedName).trim() !== "");

      if (!hasBreed && !isOtherBreed) {
        itemErrors.breedId = "Breed is required";
      }

      if (isOtherBreed) {
        if (!item?.customBreedName || !item.customBreedName.trim()) {
          itemErrors.customBreedName = "Custom breed name is required";
        } else if (item.customBreedName.trim().length > 120) {
          itemErrors.customBreedName =
            "Custom breed name must not exceed 120 characters";
        }
      }

      // 3. Validate Gender
      if (!item?.gender) {
        itemErrors.gender = "Gender is required";
      }

      // 4. Validate Dog Count
      const count = item?.dogCount;
      if (
        count === "" ||
        count === null ||
        count === undefined ||
        isNaN(Number(count)) ||
        Number(count) < 0
      ) {
        itemErrors.dogCount = "Valid number of dogs is required";
      }

      // 5. Duplicate Check
      let resolvedName = "";
      if (isOtherSpecies) {
        resolvedName = `${(item.customSpeciesName || "Other").trim().toLowerCase()} - ${(item.customBreedName || item.breed || "").trim().toLowerCase()}`;
      } else if (isOtherBreed) {
        resolvedName = (item.customBreedName || "Other").trim().toLowerCase();
      } else {
        resolvedName = (item.breed || item.breedName || "").trim().toLowerCase();
      }

      if (resolvedName) {
        if (seenBreedNames.has(resolvedName)) {
          itemErrors.breedId =
            "Duplicate breed entry. Each breed entry must be unique.";
        } else {
          seenBreedNames.add(resolvedName);
        }
      }

      if (Object.keys(itemErrors).length > 0) {
        hasError = true;
        listErrors[`breedsList_${idx}`] = itemErrors;
        if (idx === 0) {
          Object.assign(listErrors, itemErrors);
        }
      }
    });

    if (hasError) {
      setBreedErrors(listErrors);
      toast.error("Please fill all mandatory breed fields");
      return false;
    }

    setBreedErrors({});
    return true;
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

    // Support saving multiple breeds if `breedsList` is present
    const list =
      Array.isArray(breedValues.breedsList) &&
      breedValues.breedsList.length > 0
        ? [...breedValues.breedsList]
        : [
            {
              id: breedValues.id || "",
              breedName: breedValues.breedName || "",
              breed: breedValues.breed || breedValues.breedName || "",
              breedId: breedValues.breedId || "",
              customBreedName: breedValues.customBreedName || "",
              gender: breedValues.gender || "",
              dogCount: breedValues.dogCount ?? 0,
              ageDescription: breedValues.ageDescription || "",
            },
          ];

    try {
      setIsSavingBreed(true);
      setBreedErrors({});

      const itemErrors = {};

      for (let i = 0; i < list.length; i++) {
        const item = list[i] || {};

        const specId =
          item.species?.id ??
          item.speciesId ??
          (typeof item.species === "number"
            ? item.species
            : item.species != null &&
              !isNaN(Number(item.species)) &&
              String(item.species).trim() !== ""
            ? Number(item.species)
            : null);

        const specName =
          item.species?.speciesName ||
          item.species?.name ||
          (typeof item.species === "string" ? item.species : "");

        const isOtherSpec =
          specId === 24 ||
          (specName && specName.toLowerCase() === "other") ||
          (item.speciesId != null && Number(item.speciesId) === 24);

        const isOtherBrd =
          item.breedId === "OTHER" ||
          (typeof item.breed === "string" &&
            item.breed.toLowerCase() === "other") ||
          Boolean(
            item.customBreedName && String(item.customBreedName).trim() !== ""
          );

        let resolvedBreedName = "";
        if (isOtherSpec) {
          const specPart = (item.customSpeciesName || "Other").trim();
          const brdPart = (item.customBreedName || item.breed || "").trim();
          resolvedBreedName = brdPart ? `${specPart} - ${brdPart}` : specPart;
        } else if (isOtherBrd) {
          resolvedBreedName = (item.customBreedName || "Other").trim();
        } else {
          resolvedBreedName = (item.breed || item.breedName || "").trim();
        }

        if (resolvedBreedName.length > 200) {
          resolvedBreedName = resolvedBreedName.slice(0, 200);
        }

        const payload = {
          id: item.id ? Number(item.id) : null,
          dogBreederDetail: { id: Number(dogBreederDetailId) },
          species: item.speciesId ? { id: Number(item.speciesId) } : null,
          speciesId: item.speciesId ? Number(item.speciesId) : null,
          breedName: resolvedBreedName,
          customSpeciesName:
            isOtherSpec && item.customSpeciesName
              ? item.customSpeciesName.trim()
              : null,
          customBreedName:
            isOtherBrd && item.customBreedName
              ? item.customBreedName.trim()
              : null,
          dogCount:
            item.dogCount === "" ||
            item.dogCount === null ||
            item.dogCount === undefined
              ? 0
              : Number(item.dogCount),
          ageDescription: (item.ageDescription || "").trim(),
          gender: (item.gender || "MALE").toUpperCase(),
          priceOffered:
            item.priceOffered !== "" &&
            item.priceOffered !== null &&
            item.priceOffered !== undefined &&
            !isNaN(Number(item.priceOffered))
              ? Number(item.priceOffered)
              : null,
          description: (item.description || "").trim(),
          displayOrder: i,
        };

        console.log("DOG BREED SAVE PAYLOAD (item):", payload);

        try {
          const response = await saveDogBreederBreed(payload);

          if (response?.isSuccess === false) {
            const data = response?.data ?? {};
            itemErrors[`breedsList_${i}`] = data?.errors || { _error: data };
          } else {
            const savedData = getResponsePayload(response) || payload;
            list[i] = {
              ...item,
              ...savedData,
              breedName: resolvedBreedName,
            };
          }
        } catch (err) {
          console.error("DOG BREED ITEM SAVE ERROR:", err);
          itemErrors[`breedsList_${i}`] = {
            _error: err?.message || "Save failed",
          };
        }
      }

      if (Object.keys(itemErrors).length > 0) {
        setBreedErrors(itemErrors);
        toast.error("Some breeds could not be saved. Check errors.");
        return;
      }

      // All saved — persist ids back to state
      setBreedValues((prev) => ({
        ...prev,
        breedsList: list,
        id: list[0]?.id || prev.id,
        breedName: list[0]?.breedName || prev.breedName,
        dogCount: list[0]?.dogCount ?? prev.dogCount,
        gender: list[0]?.gender || prev.gender,
        ageDescription: list[0]?.ageDescription || prev.ageDescription,
        priceOffered: list[0]?.priceOffered ?? "",
        description: list[0]?.description || "",
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

      goToStep(3);
    } catch (error) {
      console.error("DOG BREED SAVE ERROR:", error);

      const data = error?.response?.data;

      if (typeof data === "object") {
        setBreedErrors(data?.errors || {});
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
      goToStep(4);
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

  const validateDocument = () => {
    const newErrors = {};

    dogBreederDocumentList.forEach((document) => {
      if (document.mandatory && !documentValues[document.id]) {
        newErrors[document.id] = "This document is required";
      }
    });

    setDocumentErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDocument = async () => {
    if (!validateDocument()) {
      toast.error("Please upload all mandatory documents");
      return;
    }

    let applicationId = toValidNumber(formValues.applicationId);

    if (!applicationId) {
      try {
        const draftResponse = await getDogBreederRegistrationDraft();
        const draftPayload = getResponsePayload(draftResponse);

        applicationId = extractApplicationId(draftPayload);
      } catch {
        toast.error("Could not load saved draft details.");
        return;
      }
    }

    if (!applicationId) {
      toast.error("Please save Step 1 first. Application ID missing.");
      return;
    }

    const uploadedBy = getUserNumericId(user);

    if (!uploadedBy) {
      toast.error("Login user ID missing. Please login again.");
      return;
    }

    console.log("FINAL DOCUMENT UPLOAD DATA", {
      applicationId,
      formApplicationId: formValues.applicationId,
      uploadedBy,
      user,
      userKey,
    });

    try {
      setIsSavingDocument(true);
      setDocumentErrors({});

      const updatedDocuments = { ...documentValues };

      for (const document of dogBreederDocumentList) {
        const documentItem = documentValues?.[document.id];

        if (!documentItem) {
          if (document.mandatory) {
            setDocumentErrors((prev) => ({
              ...prev,
              [document.id]: "This document is required",
            }));

            toast.error(`${document.name} is required`);
            return;
          }

          continue;
        }

        if (documentItem?.saved === true && documentItem?.changed !== true) {
          continue;
        }

        const selectedFile =
          documentItem?.file instanceof File
            ? documentItem.file
            : documentItem instanceof File
              ? documentItem
              : null;

        console.log("UPLOAD FILE CHECK", {
          applicationId,
          documentTypeId: document.id,
          documentName: document.name,
          documentItem,
          file: selectedFile,
          isFile: selectedFile instanceof File,
          name: selectedFile?.name,
          size: selectedFile?.size,
        });

        if (!selectedFile) {
          toast.error(`${document.name} file missing`);
          return;
        }

        const response = await uploadApplicationDocument({
          applicationId,
          documentTypeId: document.id,
          uploadedBy,
          file: selectedFile,
        });

        const responseData = response?.data;

        if (
          responseData?.status === "BAD_REQUEST" ||
          responseData?.resultCode === "COMM_OPERATION_FAILURE"
        ) {
          setDocumentErrors(responseData?.errors || {});

          toast.error(
            responseData?.resultString ||
              responseData?.detail ||
              "Could not save document details"
          );

          return;
        }

        const savedDocument = getResponsePayload(response);

        const savedDocumentId =
          getSavedDocumentId(savedDocument) ||
          getSavedDocumentId(documentItem);

        updatedDocuments[document.id] = {
          id: savedDocumentId,
          documentId: savedDocumentId,
          applicationDocumentId: savedDocumentId,
          documentTypeId: document.id,
          name: savedDocument?.fileName || selectedFile.name,
          fileName: savedDocument?.fileName || selectedFile.name,
          type: savedDocument?.mimeType || selectedFile.type,
          mimeType: savedDocument?.mimeType || selectedFile.type,
          size: savedDocument?.fileSizeBytes || selectedFile.size,
          fileSizeBytes: savedDocument?.fileSizeBytes || selectedFile.size,
          filePath: savedDocument?.filePath || "",
          uploadedAt: savedDocument?.uploadedAt || "",
          saved: true,
          changed: false,
          file: null,
        };
      }

      setDocumentValues(updatedDocuments);

      setFormValues((prev) => ({
        ...prev,
        applicationId,
      }));

      setPreviewValues(null);

      toast.success("Documents saved successfully");
      goToStep(5);
    } catch (error) {
      console.error("DOCUMENT SAVE ERROR", error);

      const data = error?.response?.data;

      if (typeof data === "object") {
        setDocumentErrors(data?.errors || {});
      }

      toast.error(
        data?.resultString ||
          data?.detail ||
          data?.errors?.[0] ||
          "Could not save document details"
      );
    } finally {
      setIsSavingDocument(false);
    }
  };
const handleSubmitApplication = async () => {
  const applicationId = formValues.applicationId;

  if (!applicationId) {
    toast.error("Application ID not found.");
    return;
  }

  const docs = Object.values(documentValues || {});
  const hasPanCard = docs.some((doc) => {
    const typeId = doc?.documentTypeId ?? doc?.documentType?.id ?? doc?.id;
    const code = doc?.documentType?.code || doc?.documentTypeCode || doc?.code;
    const name = doc?.documentTypeName || doc?.documentType?.name || doc?.name || doc?.fileName || "";
    const hasFile = Boolean(doc?.id || doc?.filePath || doc?.file);
    return (
      (Number(typeId) === 32 || code === "PAN_CARD" || /pan\s*card/i.test(name)) &&
      hasFile
    );
  });

  if (!hasPanCard) {
    toast.error("Mandatory PAN Card document is missing. Please upload your PAN Card in Documents step.");
    return;
  }

  try {
    setIsSubmitting(true);

    await submitDogBreederApplication(applicationId);

    toast.success("Application submitted successfully.");
  } catch (error) {
    console.error(error);
    const data = error?.response?.data;
    const serverMsg =
      data?.detail ||
      data?.message ||
      data?.payLoad ||
      data?.resultString ||
      (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
      "Submission failed.";
    toast.error(serverMsg);
  } finally {
    setIsSubmitting(false);
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
              dogBreederDetailId={
                facilityValues.dogBreederDetailId || formValues.id
              }
              onChange={handleFacilityChange}
              onBack={() => goToStep(0)}
              onSave={handleSaveFacility}
            />
          )}

          {activeStep === 2 && (
            <Step3DogBreedDetails
              formValues={breedValues}
              errors={breedErrors}
              isSaving={isSavingBreed}
              onChange={handleBreedChange}
              onBack={() => goToStep(1)}
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
              onBack={() => goToStep(2)}
              onSave={handleSaveDeclaration}
            />
          )}

          {activeStep === 4 && (
            <Step5Documents
              documents={documentValues}
              setDocuments={setDocumentValues}
              errors={documentErrors}
              isSaving={isSavingDocument}
              onBack={() => goToStep(3)}
              onSave={handleSaveDocument}
            />
          )}

 {activeStep === 5 && (
  <>
    {!previewValues ? (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Preview Application
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Click Preview to view your completed application.
        </Typography>

        <Button
          variant="contained"
          onClick={handlePreviewClick}
          sx={{ textTransform: "none" }}
        >
          Preview Application
        </Button>
      </Box>
    ) : (
      <>
       <Step6Preview
  breederDetails={previewValues.breederDetails}
  facilityDetails={previewValues.facilityDetails}
  breedDetails={previewValues.breedDetails}
  declarationDetails={previewValues.declarationDetails}
  documents={previewValues.documents || documentValues}
  documentValues={previewValues.documents || documentValues}
  documentDetails={previewValues.documentDetails}
/>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setPreviewValues(null);
            }}
            sx={{ textTransform: "none" }}
          >
            Close Preview
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitApplication}
            disabled={isSubmitting}
            sx={{ textTransform: "none" }}
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Application"}
          </Button>
        </Box>
      </>
    )}
  </>
)}

          {activeStep === 6 && (
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

            {activeStep === 5 && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setPreviewValues(null);
                    goToStep(4);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Back
                </Button>

                {previewValues && (
                  <Button
                    variant="contained"
                    endIcon={<NavigateNextIcon />}
                    onClick={() => goToStep(6)}
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

            {activeStep === 6 && (
              <Button
                variant="outlined"
                onClick={() => goToStep(5)}
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