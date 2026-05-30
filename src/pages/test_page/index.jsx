import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";
import Form from "./Form";
import Filter from "./Filter";
import List from "./List";
import { useEffect, useState } from "react";
import useDropDown from "../../hooks/useDropDown";
import { getUserRoleAssignments } from "../../api-client/users";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import {
  USERS_API_URL,
  USERS_LIST_URL,
  ROLES_DROPDOWN_URL,
  OFFICE_DROPDOWN_URL,
} from "../../config/endpoints";
import useCan from "../../hooks/useCan";
import { useAuthz } from "../../context/AuthzContext";
import { TEST_PAGE_PATH } from "../../config/routes";

const UsersPage = () => {
  const { can } = useAuthz();
  const { canList, canSave, canEdit, canDelete, canAction } = useCan(TEST_PAGE_PATH);
  const [roleAssignmentsMap, setRoleAssignmentsMap] = useState({});
  const dropDownLists = useDropDown([
    {
      api_url: ROLES_DROPDOWN_URL,
      includeToken: true,
      dropdown: "role",
    },
    {
      api_url: OFFICE_DROPDOWN_URL,
      includeToken: true,
      dropdown: "office",
    },
  ]);

  const tableColumns = [
    { attr: "fname", header: "First Name" },
    { attr: "lname", header: "Last Name" },
    { attr: "email", header: "Email" },
    { attr: "mobileNo", header: "Mobile No" },
    { attr: "username", header: "Username" },
    {
      attr: "office",
      header: "Office",
      render: (row) => row.office?.name || "-",
    },
    {
      attr: "roles",
      header: "Roles",
      render: (row) => {
        const roles = [...(roleAssignmentsMap?.[row.id] || [])]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        if (!roles.length) {
          return "-";
        }
        return (
          <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
            {roles.map((role) => (
              <Chip key={`${row.id}-${role}`} label={role} size="small" color="primary" variant="outlined" />
            ))}
          </Stack>
        );
      },
    },
    // {
    //   attr: "roleName",
    //   header: "Role",
    //   render: (row) => row.role?.name || "-", // Render nested role
    // },
  ];

  const loadRoleAssignments = async () => {
    const response = await getUserRoleAssignments();
    if (response?.isSuccess) {
      setRoleAssignmentsMap(response?.data?.payLoad || {});
    }
  };

  useEffect(() => {
    loadRoleAssignments();
  }, []);

  return (
<DataTable
  api_url={USERS_API_URL}
  list_url={USERS_LIST_URL}
  alertString="User"
  tableColumns={tableColumns}
  includeFilter={canList}
  dropDownLists={dropDownLists}
  disableAdd={!canSave}
  pageTitle="User Registration"
  canList={canList}
  canEdit={canEdit}
  canDelete={canDelete}
  canExport={can(TEST_PAGE_PATH, "export")}
>
  {/* ---- CHILD 0 → FILTER ---- */}
  <Filter dropDownLists={dropDownLists} />

  {/* ---- CHILD 1 → FORM DIALOG ---- */}
  <FormDialog maxWidth="md">
    <Form dropDownLists={dropDownLists} />
  </FormDialog>

  {/* ---- CHILD 2 → LIST ---- */}
  <List loadRoleAssignments={loadRoleAssignments} canAssignRoles={canAction("assign-roles")} />
</DataTable>

  );
};

export default UsersPage;
