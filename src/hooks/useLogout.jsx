import { LOGIN_PATH } from "../config/routes";
import { encryptStorage } from "../utils";
// import { logoutUser } from "../api-client/accounts";
const useLogout = () => {
  const handlelogout = async () => {
    // await logoutUser();
    localStorage.clear();
    encryptStorage.removeItem("userAuthDetails");
    window.location = `/${LOGIN_PATH}`;
  };
  return { handlelogout };
};

export default useLogout;
