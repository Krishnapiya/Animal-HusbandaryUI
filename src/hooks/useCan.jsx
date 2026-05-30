import { useAuthz } from "../context/AuthzContext";

const useCan = (menuKey) => {
  const { can } = useAuthz();
  return {
    canList: can(menuKey, "list"),
    canSave: can(menuKey, "save"),
    canEdit: can(menuKey, "edit"),
    canDelete: can(menuKey, "delete"),
    canAction: (action) => can(menuKey, action),
  };
};

export default useCan;
