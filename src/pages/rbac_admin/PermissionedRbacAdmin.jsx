import PermissionGate from "../../components/PermissionGate";
import { RBAC_ADMIN_PATH } from "../../config/routes";
import RbacAdminPage from "./index";

const PermissionedRbacAdmin = () => {
  return (
    <PermissionGate menuKey={RBAC_ADMIN_PATH} action="list">
      <RbacAdminPage />
    </PermissionGate>
  );
};

export default PermissionedRbacAdmin;
