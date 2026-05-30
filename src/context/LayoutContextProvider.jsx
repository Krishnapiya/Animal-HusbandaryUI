import PropTypes from "prop-types";
import { useState } from "react";
import LayoutContext from "./layout-context";

const LayoutContextProvider = (props) => {
  const [open, setOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(-1);
  const [profilePicture, setProfilePicture] = useState("");
  return (
    <LayoutContext.Provider
      value={{
        open: open,
        setOpen: setOpen,
        openSubMenu: openSubMenu,
        setOpenSubMenu: setOpenSubMenu,
        profilePicture: profilePicture,
        setProfilePicture: setProfilePicture,
        toggleDarkMode: props.toggleDarkMode,
      }}
    >
      {props.children}
    </LayoutContext.Provider>
  );
};

LayoutContextProvider.propTypes = {
  children: PropTypes.any,
  toggleDarkMode: PropTypes.func,
};

export default LayoutContextProvider;
