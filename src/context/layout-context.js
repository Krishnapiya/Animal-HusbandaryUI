import { createContext } from "react";
// Creating the context object and passing the default values.
const LayoutContext = createContext({
  open: true,
  setOpen: null,
  profilePicture: "",
  setProfilePicture: null,
  openSubMenu: -1,
  setOpenSubMenu: null,
});

export default LayoutContext;
