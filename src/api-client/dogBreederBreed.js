/* eslint-disable */
import { DOG_BREEDER_BREED_API_URL } from "../config/endpoints";
import { addItem } from "./apiCall";

export const saveDogBreederBreed = async (payload) => {
  return addItem(`${DOG_BREEDER_BREED_API_URL}save`, {
    payLoad: payload,
  });
};