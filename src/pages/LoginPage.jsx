/* eslint-disable */
import { useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authenticateOfficer } from "../api-client/accounts";
import { toast } from "material-react-toastify";
import { encryptStorage } from "../utils";
import { ROOT_PATH, } from "../config/routes";
import { useAuthz } from "../context/AuthzContext";
// import logo from "../assets/logo.png";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
      {"Design & Developed by Software Group © "}
      {new Date().getFullYear()}
    </Typography>
  );
}



const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshAuthz } = useAuthz();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code");

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
    console.log("Full response:", response);

    if (response.isSuccess) {
      const userData = response.data;
      // Save full response to storage
      encryptStorage.setItem("userAuthDetails", JSON.stringify({
        token: response.data.token,
        user: response.data.user
      }));
      
      console.log("Saved token:", response.data.token);

  
      await refreshAuthz();
      navigate(`/${ROOT_PATH}`);
  
    } else {
       const errData = response?.data ?? {};
      if ("non_field_errors" in response.data) {
        toast.error(response.data.non_field_errors[0]);
      } else if ("detail" in response.data) {
        toast.error(response.data.detail[0]);
      } else {
        toast.error("Login failed");
      }
    }
  };
  
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(180deg, #f5f7fb 0%, #eef2f7 100%)"
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              color: "#1f2937",
              mb: 0.5,
              fontSize: { xs: "1.7rem", sm: "2rem" },
              userSelect: "none"
            }}
          >
            KELTRON ADMIN LTE
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Administration Portal
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: 2,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)"
          }}
        >
          <CardHeader
            // avatar={<Avatar src={logo} alt="Logo" />}
            title="Sign In"
            subheader="Use your username and password"
            sx={{ textAlign: "center", mt: 1 }}
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  textTransform: "none",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1d4ed8"
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

            </Box>
          </CardContent>
        </Card>
        <Copyright />
      </Container>
    </Box>
  );
};

export default LoginPage;