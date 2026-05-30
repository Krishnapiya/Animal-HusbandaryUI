import PropTypes from "prop-types";
import VerifiedIcon from "@mui/icons-material/Verified";
import Button from "@mui/material/Button";

export const VerifyButton = ({ onClick, ...props }) => {
  return (
    <Button
      color="primary"
      size="small"
      startIcon={<VerifiedIcon sx={{ fontSize: 18 }} />}
      onClick={onClick}
      {...props}
    >
      Verify
    </Button>
  );
};

VerifyButton.propTypes = {
  onClick: PropTypes.func,
};
