import { PET_SHOP_REGISTRATION_DRAFT_URL, PET_SHOP_REGISTRATION_STEP1_URL } from "../config/endpoints";
import { addItem, getItemList } from "./apiCall";

export const getPetShopRegistrationDraft = async () => {
  return getItemList(PET_SHOP_REGISTRATION_DRAFT_URL);
};

export const savePetShopRegistrationStep1 = async (payload) => {
  return addItem(PET_SHOP_REGISTRATION_STEP1_URL, { payLoad: payload });
};
