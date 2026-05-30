import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const PageTitle = ({ title }) => {
  return (
    <Box
      sx={{
        marginBottom: 2,
        display: "flex",
        alignItems: "center",
        gap: 1, // Spacing between icon (if added later) and text
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "primary.main", // Uses MUI theme color
          letterSpacing: 1.1,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
