import DataTable from "../../components/page_builder/DataTable";
import FormDialog from "../../components/page_builder/FormDialog";

import Filter from "./Filter";
import Form from "./Form";
import List from "./List";

import { useAuthz } from "../../context/AuthzContext";
import useCan from "../../hooks/useCan";

import {
  DOG_BREEDER_APPLICATION_API_URL,
  DOG_BREEDER_APPLICATION_CVO_API_URL,
} from "../../config/endpoints";

import {
  DOG_BREEDER_APPLICATION_PATH,
} from "../../config/routes";

import {
  getUserAttributes,
} from "../../utils";

const normalizeRole = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");

const getUserRoles = (user) => {
  const roleValues = [
    user?.role,
    user?.roleName,
    user?.role?.roleName,
    user?.role?.name,
    user?.role?.authority,
    user?.authority,
  ];

  if (Array.isArray(user?.roles)) {
    roleValues.push(...user.roles);
  }

  if (Array.isArray(user?.authorities)) {
    roleValues.push(...user.authorities);
  }

  return roleValues
    .flatMap((role) => {
      if (typeof role === "string") {
        return [role];
      }

      return [
        role?.roleName,
        role?.name,
        role?.authority,
        role?.code,
      ];
    })
    .filter(Boolean)
    .map(normalizeRole);
};

const DogBreederApplicationPage = () => {
  const { can } = useAuthz();

  const { canList } = useCan(
    DOG_BREEDER_APPLICATION_PATH
  );

  const loggedInUser = getUserAttributes();

  const userRoles = getUserRoles(loggedInUser);

  const isAdmin = userRoles.includes("ADMIN");

  const isCvo = userRoles.includes("CVO");

  // Allow list access for ADMIN, CVO, or if useCan returns true
  const canAccessList = isAdmin || isCvo || canList;

  const tableColumns = [
    {
      attr: "applicationNumber",
      header: "Application Number",
    },
    {
      attr: "entityType",
      header: "Entity Type",
    },
    {
      attr: "applicationKind",
      header: "Application Kind",
    },
    {
      attr: "status",
      header: "Status",
      render: (row) =>
        row.status?.name ||
        row.status?.statusName ||
        row.statusName ||
        "-",
    },
    {
      attr: "district",
      header: "District",
      render: (row) =>
        row.district?.name ||
        row.district?.districtName ||
        row.districtName ||
        "-",
    },
  ];

  const selectedApiUrl = isCvo
    ? DOG_BREEDER_APPLICATION_CVO_API_URL
    : DOG_BREEDER_APPLICATION_API_URL;

  console.log("Dog Breeder Login", {
    userRoles,
    isAdmin,
    isCvo,
    canList,
    canAccessList,
    selectedApiUrl,
  });

  return (
    <DataTable
      key={`${isCvo}-${selectedApiUrl}`}
      api_url={selectedApiUrl}
      list_url={selectedApiUrl}
      alertString="Dog Breeder Registration Application"
      tableColumns={tableColumns}
      includeFilter={canAccessList}
      disableAdd={true}
      pageTitle="Dog Breeder Registration Application "
      canList={canAccessList}
      canEdit={false}
      canDelete={false}
      canExport={
        isAdmin &&
        can(
          DOG_BREEDER_APPLICATION_PATH,
          "export"
        )
      }
    >
      <Filter />

      <FormDialog maxWidth="md">
        <Form />
      </FormDialog>

      <List
        showForwardAction={
          isAdmin && !isCvo
        }
      />
    </DataTable>
  );
};

export default DogBreederApplicationPage;