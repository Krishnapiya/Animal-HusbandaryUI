import { PET_SHOP_REGISTRATION_DRAFT_URL, PET_SHOP_REGISTRATION_STEP1_URL, PET_SHOP_REGISTRATION_STEP2_URL, } from "../config/endpoints";
import { addItem, getItemList,editSingleItem, } from "./apiCall";

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