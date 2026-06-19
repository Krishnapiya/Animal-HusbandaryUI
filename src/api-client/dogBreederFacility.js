/* eslint-disable */
import { DOG_BREEDER_FACILITY_API_URL } from "../config/endpoints";
import { addItem } from "./apiCall";

export const saveDogBreederFacility = async (payload) => {
  return addItem(`${DOG_BREEDER_FACILITY_API_URL}save`, {
    payLoad: payload,
  });
};