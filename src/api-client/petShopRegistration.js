import { PET_SHOP_REGISTRATION_DRAFT_URL, PET_SHOP_REGISTRATION_STEP1_URL, PET_SHOP_REGISTRATION_STEP2_URL,DOCUMENT_TYPE_LIST_URL } from "../config/endpoints";
import { addItem, getItemList,editSingleItem, } from "./apiCall";
import { BASE_API_URL } from "./apiCall";
import { callApi } from "./client";
import { getHeader } from "../utils";
import axios from "axios";
export const getPetShopRegistrationDraft = async () => {
  return getItemList(PET_SHOP_REGISTRATION_DRAFT_URL);
};

export const savePetShopRegistrationStep1 = async (payload) => {
  return addItem(PET_SHOP_REGISTRATION_STEP1_URL, { payLoad: payload });
};
export const savePetShopRegistrationStep2 = async (payload) => {
  return addItem(PET_SHOP_REGISTRATION_STEP2_URL, {   payLoad: payload,  } );};

export const updatePetShopRegistrationStep2 = async (payload) => {
  return editSingleItem( PET_SHOP_REGISTRATION_STEP2_URL,{ payLoad: payload, }); };

export const getPetShopFacility = async (petShopDetailId) => {
  return getItemList(`/petshop/auth/master/pet-shop-facility/draft/${petShopDetailId}`);};

  export const savePetShopProposedAnimal = async (payload) => {
    return addItem( "/petshop/auth/awb/pet-shop-proposed-animal/save", { payLoad: payload,  } );};

    export const getAnimalSpeciesDropdown = async () => {
  return getItemList( "/admin/auth/master/animal-species/list/all",{dropDown: true,  pageNo: 0, pageSize: 500, } );};

export const getPetShopProposedAnimals = async (applicationId) => {
  return getItemList( `/petshop/auth/awb/pet-shop-proposed-animal/draft/${applicationId}` );};
export const updatePetShopProposedAnimal = async ( payload) => {
  return editSingleItem( "/petshop/auth/awb/pet-shop-proposed-animal/save", {   payLoad: payload, } );};

export const getDocumentTypes = () =>
  getItemList(DOCUMENT_TYPE_LIST_URL, { pageNo: 0, pageSize: 100 });

export const saveApplicationDocument = (payload) =>
  addItem("/petshop/auth/application-document/save", { payLoad: payload });
  addItem("/petshop/auth/application-document/save", { payLoad: payload });

export const getApplicationDocuments = (applicationId) =>
  getItemList(
  `/petshop/auth/application-document/draft/${applicationId}`
);

export const updateApplicationDocument = (payload) =>
  editSingleItem("/petshop/auth/application-document/save", {
    payLoad: payload,
  });

export const saveApplicationDeclaration = (payload) =>
  addItem("/petshop/auth/master/application-declaration/save", {
    payLoad: payload,
  });

export const getApplicationDeclaration = (applicationId) =>
  getItemList(
    `/petshop/auth/master/application-declaration/draft/${applicationId}`
  );

export const updateApplicationDeclaration = (payload) =>
  editSingleItem("/petshop/auth/master/application-declaration/save", {
    payLoad: payload,
  });

export const uploadApplicationDocument = ({
  file,
  applicationId,
  documentTypeId,
  uploadedBy,
}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("applicationId", applicationId);
  formData.append("documentTypeId", documentTypeId);
  formData.append("uploadedBy", uploadedBy);

  return callApi({
    method: "POST",
    baseURL: BASE_API_URL,
    url: "/petshop/auth/application-document/upload",
    data: formData,
    headers: getHeader(),
  });
};

const encodeDocumentFilePath = (filePath) =>
  filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

export const fetchApplicationDocumentBlob = async (filePath) => {
  const response = await axios({
    method: "GET",
    baseURL: BASE_API_URL,
    url: `/petshop/auth/application-document/view/${encodeDocumentFilePath(filePath)}`,
    headers: getHeader() || {},
    responseType: "blob",
  });

  const blob = response.data;

  if (blob?.type?.includes("application/json")) {
    const errorText = await blob.text();
    throw new Error(errorText || "Failed to load document");
  }

  return blob;
};

export const downloadPetShopRegistrationApplication = async (
  applicationId
) => {
  if (!applicationId) {
    return {
      isSuccess: false,
      message: "Application ID is required",
    };
  }

  try {
    const response = await axios({
      method: "GET",
      baseURL: BASE_API_URL,
      url: `/petshop/auth/registration-application/download/${applicationId}`,
      headers: getHeader(),
      responseType: "blob",
    });

    const blob = response.data;
    const contentDisposition =
      response.headers["content-disposition"];
    let fileName = `PetShopApplication-${applicationId}.zip`;

    if (contentDisposition) {
      const match = contentDisposition.match(
        /filename="?([^"]+)"?/i
      );
      if (match?.[1]) {
        fileName = match[1];
      }
    }

    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    return { isSuccess: true };
  } catch (error) {
    return {
      isSuccess: false,
      status: error.response?.status,
      message:
        error.response?.status === 404
          ? "Application not found"
          : "Failed to download application package",
    };
  }
};