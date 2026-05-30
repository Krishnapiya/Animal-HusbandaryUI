import { transformExtent } from "ol/proj";

export const keralaExtend = transformExtent(
  [74.5, 8.2, 77.5, 12.8],
  "EPSG:4326",
  "EPSG:3857",
);
