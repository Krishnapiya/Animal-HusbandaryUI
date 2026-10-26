import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  Link,
  Typography,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PetsIcon from "@mui/icons-material/Pets";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "material-react-toastify";
import TextInput from "../components/FormComponents/TextInput";
import { registerPetShopOwner } from "../api-client/accounts";
import { encryptStorage } from "../utils";
import {
  LOGIN_PATH,
  PET_SHOP_REGISTER_PATH,
  DOG_BREEDER_REGISTER_PATH
} from "../config/routes";
import { useAuthz } from "../context/AuthzContext";
import DepartmentSiteFrame, { SITE } from "../components/branding/DepartmentSiteFrame";
import { BRAND_TEXT } from "../config/branding";

const initialForm = {
  fname: "",
  lname: "",
  email: "",
  mobileNo: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const PetShopOwnerRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ownerType = searchParams.get("ownerType") || "PET_SHOP";
  const isDogBreeder = ownerType === "DOG_BREEDER";

  const { refreshAuthz } = useAuthz();
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const payload = {
      ...formValues,
      ownerType: ownerType,
    };

    const response = await registerPetShopOwner(payload);
    setIsSubmitting(false);

    if (response.isSuccess) {
      encryptStorage.setItem(
        "userAuthDetails",
        JSON.stringify({
          token: response.data.token,
          user: response.data.user,
        })
      );

      await refreshAuthz();

      toast.success(
        isDogBreeder
          ? "Account created. Continue with dog breeder registration."
          : "Account created. Continue with pet shop registration."
      );

      navigate(
  isDogBreeder
    ? `/${DOG_BREEDER_REGISTER_PATH}`
    : `/${PET_SHOP_REGISTER_PATH}`
);
      return;
    }

    const data = response.data ?? {};
    if (typeof data === "object" && !Array.isArray(data)) {
      setErrors(data);
      const firstError = Object.values(data)[0];
      if (firstError) {
        toast.error(String(firstError));
      }
    } else {
      toast.error("Registration failed");
    }
  };

  const pageTitle = isDogBreeder
    ? "Dog breeder registration"
    : "Pet shop owner registration";

  return (
    <DepartmentSiteFrame>
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 3, md: 5 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "0.85fr 1.15fr" },
          gap: { xs: 3, md: 5 },
          alignItems: "start",
        }}
      >
        <Box sx={{ pt: { md: 2 } }}>
          <Typography
            sx={{
              color: SITE.green,
              fontWeight: 800,
              letterSpacing: 0.4,
              fontSize: { xs: 28, sm: 34 },
              lineHeight: 1.15,
              textTransform: "uppercase",
            }}
          >
            {pageTitle}
          </Typography>
          <Typography sx={{ mt: 1.5, color: SITE.muted, lineHeight: 1.7, maxWidth: 420 }}>
            {BRAND_TEXT.portalTitle}
          </Typography>

          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                step: "01",
                title: "Create your login",
                detail: "Name, contact, and password for this account.",
              },
              {
                step: "02",
                title: isDogBreeder ? "Dog breeder application" : "Pet shop application",
                detail: "You continue to the application after the account is created.",
              },
            ].map((item) => (
              <Box key={item.step} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    borderRadius: "50%",
                    border: "5px solid #e7d7c3",
                    bgcolor: "#fff",
                    color: SITE.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                  }}
                >
                  {item.step}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: SITE.teal }}>{item.title}</Typography>
                  <Typography sx={{ color: SITE.muted, fontSize: 14, mt: 0.25 }}>
                    {item.detail}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: 4,
              width: 92,
              height: 92,
              borderRadius: "50%",
              border: "6px solid #e7d7c3",
              bgcolor: "#fff",
              color: SITE.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": { fontSize: 40 },
            }}
          >
            {isDogBreeder ? <PetsIcon /> : <StorefrontIcon />}
          </Box>
        </Box>

        <Card
          sx={{
            borderRadius: 2,
            backgroundColor: "#fff",
            border: `1px solid ${SITE.line}`,
            boxShadow: "0 16px 40px rgba(12, 60, 76, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: 22, color: SITE.teal }}>
              Account details
            </Typography>
            <Typography sx={{ mt: 0.5, mb: 2, color: SITE.muted, fontSize: 14 }}>
              Basic information to create your login
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                "& .MuiOutlinedInput-root": { bgcolor: "#fff" },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: SITE.teal },
                "& .MuiInputLabel-root.Mui-focused": { color: SITE.teal },
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: SITE.green, mb: 1, letterSpacing: 0.4 }}>
                PERSONAL DETAILS
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="First name"
                    name="fname"
                    value={formValues.fname}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Last name"
                    name="lname"
                    value={formValues.lname}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Mobile (10 digits)"
                    name="mobileNo"
                    value={formValues.mobileNo}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
              </Grid>

              <Typography sx={{ fontSize: 13, fontWeight: 800, color: SITE.green, mt: 3, mb: 1, letterSpacing: 0.4 }}>
                LOGIN DETAILS
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextInput
                    label="Username"
                    name="username"
                    value={formValues.username}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    value={formValues.password}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextInput
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    errors={errors}
                    required
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  mb: 1,
                  textTransform: "none",
                  borderRadius: 999,
                  backgroundColor: SITE.teal,
                  boxShadow: "none",
                  "&:hover": { backgroundColor: SITE.tealDark, boxShadow: "none" },
                }}
              >
                {isSubmitting ? "Creating account..." : "Create account & continue"}
              </Button>

              <Button
                component={RouterLink}
                to={`/${LOGIN_PATH}`}
                fullWidth
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  borderColor: SITE.green,
                  color: SITE.green,
                  "&:hover": { borderColor: SITE.greenDark, backgroundColor: "#f3faf5" },
                }}
              >
                Back to sign in
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 2, color: SITE.muted }}>
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to={`/${LOGIN_PATH}`}
                sx={{ color: SITE.green, fontWeight: 700 }}
              >
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ textAlign: "center", pb: 3 }}>
        <Typography variant="body2" sx={{ color: SITE.muted }}>
          {BRAND_TEXT.footer}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5, color: SITE.muted }}>
          {BRAND_TEXT.developer} © {new Date().getFullYear()}
        </Typography>
      </Box>
    </DepartmentSiteFrame>
  );
};

export default PetShopOwnerRegisterPage;
