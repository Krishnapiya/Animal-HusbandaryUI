import {
  DOG_BREEDER_REGISTRATION_DRAFT_URL,
  DOG_BREEDER_REGISTRATION_STEP1_URL,
  DOG_BREEDER_APPLICATION_API_URL,
  DOG_BREEDER_MY_APPLICATION_URL
} from "../config/endpoints";

import { addItem, getItemList } from "./apiCall";

export const getDogBreederRegistrationDraft = async () => {
  return getItemList(DOG_BREEDER_REGISTRATION_DRAFT_URL);
};

export const saveDogBreederRegistrationStep1 = async (payload) => {
  return addItem(DOG_BREEDER_REGISTRATION_STEP1_URL, {
    payLoad: payload,
  });
};

export const saveDogBreederDetail = async (payload) => {
  return saveDogBreederRegistrationStep1(payload);
};

/**
 * Submit Dog Breeder Application
 */
export const submitDogBreederApplication = async (applicationId) => {
  return addItem(
    `${DOG_BREEDER_APPLICATION_API_URL}submit/${applicationId}`,
    {}
  );
};
export const getDogBreederMyApplications = async () => {
  return getItemList(DOG_BREEDER_MY_APPLICATION_URL);
};