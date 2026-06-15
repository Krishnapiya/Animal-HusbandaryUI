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
import SaveIcon from "@mui/icons-material/Save";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { toast } from "material-react-toastify";
import WizardStepper from "./WizardStepper";
import Step1ShopOwner from "./Step1ShopOwner";
import {
  getPetShopRegistrationDraft,
  savePetShopRegistrationStep1,
} from "../../api-client/petShopRegistration";
import { getUserAttributes } from "../../utils";

const initialStep1 = {
  applicationId: "",
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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const response = await getPetShopRegistrationDraft();
      if (cancelled) {
        return;
      }

      if (response?.isSuccess) {
        const draft =
          response.data?.payLoad ?? response.data?.payload ?? response.data;
        if (draft?.applicationId) {
          setFormValues((current) => mapDraftToFormValues(draft, current));
          setDraftLoaded(true);
        }
      }

      setIsLoadingDraft(false);
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

  const handleSaveStep1 = async () => {
    setIsSaving(true);
    setErrors({});
    const response = await savePetShopRegistrationStep1(buildStep1Payload());
    setIsSaving(false);

    if (response.isSuccess) {
      const payload = response.data?.payLoad ?? response.data?.payload ?? response.data;
      setFormValues({
        ...formValues,
        applicationId: payload?.applicationId ?? formValues.applicationId,
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

          {activeStep > 0 && (
            <Typography variant="body1" color="text.secondary">
              Steps 2–6 (facility, animals, declaration, documents, payment) will
              be enabled in the next sprint. Step 1 draft is saved when you click
              Save &amp; Continue.
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
            {activeStep === 0 && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveStep1}
                disabled={isSaving}
                sx={{ textTransform: "none", backgroundColor: "#2563eb" }}
              >
                {isSaving ? "Saving..." : "Save & continue"}
              </Button>
            )}
            {activeStep > 0 && activeStep < 5 && (
              <Button
                variant="outlined"
                endIcon={<NavigateNextIcon />}
                onClick={() => setActiveStep((s) => Math.min(s + 1, 5))}
                sx={{ textTransform: "none" }}
              >
                Next section (preview)
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PetShopRegisterPage;
