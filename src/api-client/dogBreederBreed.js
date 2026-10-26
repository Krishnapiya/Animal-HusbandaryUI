/* eslint-disable */
import { DOG_BREEDER_BREED_API_URL } from "../config/endpoints";
import { addItem, deleteItem } from "./apiCall";

export const saveDogBreederBreed = async (payload) => {
  return addItem(`${DOG_BREEDER_BREED_API_URL}save`, {
    payLoad: payload,
  });
};

export const deleteDogBreederBreed = async (id) => {
  return deleteItem(`${DOG_BREEDER_BREED_API_URL}delete/`, id);
};
