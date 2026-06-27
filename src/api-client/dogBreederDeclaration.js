import { DOG_BREEDER_DECLARATION_API_URL } from "../config/endpoints";
import { addItem } from "./apiCall";

export const saveDogBreederDeclaration = async (payload) => {
  return addItem(`${DOG_BREEDER_DECLARATION_API_URL}save`, {
    payLoad: payload,
  });
};