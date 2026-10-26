import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PetsIcon from "@mui/icons-material/Pets";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReportIcon from "@mui/icons-material/Report";
import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import { authenticateOfficer } from "../api-client/accounts";
import { toast } from "material-react-toastify";
import { encryptStorage } from "../utils";
import {
  ROOT_PATH,
  PET_SHOP_OWNER_SIGNUP_PATH,
  PET_SHOP_REGISTER_PATH,
  DOG_BREEDER_REGISTER_PATH,
  CITIZEN_SIGNUP_PATH,
} from "../config/routes";
import { useAuthz } from "../context/AuthzContext";
import { BRAND_TEXT } from "../config/branding";
import DepartmentSiteFrame, { SITE } from "../components/branding/DepartmentSiteFrame";

function Copyright() {
  return (
    <Box sx={{ mt: 3, textAlign: "center" }}>
      <Typography variant="body2" sx={{ color: SITE.muted }}>
        {BRAND_TEXT.footer}
      </Typography>
      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: SITE.muted }}>
        {BRAND_TEXT.developer} © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshAuthz } = useAuthz();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getOwnerType = (user) => {
    return (
      user?.ownerType ||
      user?.entityType ||
      user?.applicantType ||
      user?.userType ||
      ""
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const loginPayload = {
      username: form.username.value,
      password: form.password.value,
    };

    setIsSubmitting(true);

    const response = await authenticateOfficer(loginPayload);

    setIsSubmitting(false);

    if (response?.isSuccess) {
      const user = response.data?.user;
      const token = response.data?.token;

      encryptStorage.setItem(
        "userAuthDetails",
        JSON.stringify({
          token: token,
          user: user,
        })
      );

      await refreshAuthz();

      const ownerType = getOwnerType(user);

      if (ownerType === "DOG_BREEDER") {
        navigate(`/${DOG_BREEDER_REGISTER_PATH}`);
        return;
      }

     if (ownerType === "PET_SHOP") {
  navigate(`/${PET_SHOP_REGISTER_PATH}`);
  return;
}

if (ownerType === "CITIZEN") {
  navigate(`/${ROOT_PATH}`);
  return;
}

navigate(`/${ROOT_PATH}`);
return;
    }

    const errData = response?.data ?? {};

    if (errData?.non_field_errors) {
      toast.error(errData.non_field_errors[0]);
    } else if (errData?.detail) {
      toast.error(Array.isArray(errData.detail) ? errData.detail[0] : errData.detail);
    } else {
      toast.error("Login failed");
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      "&.Mui-focused fieldset": { borderColor: SITE.teal },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: SITE.teal },
  };

  const outlineButtonSx = {
    mb: 1.25,
    textTransform: "none",
    borderColor: SITE.green,
    color: SITE.green,
    borderRadius: 999,
    "&:hover": {
      borderColor: SITE.greenDark,
      backgroundColor: "#f3faf5",
    },
  };

  return (
    <DepartmentSiteFrame>
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 3, md: 6 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
          gap: { xs: 3, md: 5 },
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: SITE.green,
              fontWeight: 800,
              letterSpacing: 0.6,
              fontSize: { xs: 28, sm: 36 },
              lineHeight: 1.15,
              textTransform: "uppercase",
              maxWidth: 560,
            }}
          >
            Animal Welfare Management System
          </Typography>

          <Box sx={{ display: "flex", gap: 2.5, mt: 4, flexWrap: "wrap" }}>
            {[
              { icon: <StorefrontIcon />, label: "Pet shop" },
              { icon: <PetsIcon />, label: "Dog breeder" },
              { icon: <ReportIcon />, label: "Complaints" },
            ].map((item) => (
              <Box key={item.label} sx={{ textAlign: "center", width: 108 }}>
                <Box
                  sx={{
                    width: 92,
                    height: 92,
                    mx: "auto",
                    borderRadius: "50%",
                    border: "6px solid #e7d7c3",
                    bgcolor: "#fff",
                    color: SITE.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 18px rgba(12, 60, 76, 0.08)",
                    "& svg": { fontSize: 36 },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 0.4,
                    color: SITE.green,
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
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
              Sign in
            </Typography>
            <Typography sx={{ mt: 0.5, mb: 1, color: SITE.muted, fontSize: 14 }}>
              Use your username and password to access the portal
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                variant="outlined"
                sx={fieldSx}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                sx={fieldSx}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  mt: 3,
                  mb: 2,
                  textTransform: "none",
                  borderRadius: 999,
                  backgroundColor: SITE.teal,
                  boxShadow: "none",
                  "&:hover": { backgroundColor: SITE.tealDark, boxShadow: "none" },
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" sx={{ color: SITE.muted }}>
                  New applicant registration
                </Typography>
              </Divider>

              <Button
                component={RouterLink}
                to={`/${PET_SHOP_OWNER_SIGNUP_PATH}`}
                fullWidth
                variant="outlined"
                startIcon={<PersonAddAlt1Icon />}
                sx={outlineButtonSx}
              >
                Register as Pet Shop Owner
              </Button>

              <Button
                component={RouterLink}
                to={`/${PET_SHOP_OWNER_SIGNUP_PATH}?ownerType=DOG_BREEDER`}
                fullWidth
                variant="outlined"
                startIcon={<PetsIcon />}
                sx={outlineButtonSx}
              >
                Register as Dog Breeder
              </Button>

              <Button
                component={RouterLink}
                to={`/${CITIZEN_SIGNUP_PATH}`}
                fullWidth
                variant="outlined"
                startIcon={<PersonAddAlt1Icon />}
                sx={outlineButtonSx}
              >
                Register as Citizen
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ textAlign: "center", pb: 3 }}>
        <Copyright />
      </Box>
    </DepartmentSiteFrame>
  );
};

export default LoginPage;
