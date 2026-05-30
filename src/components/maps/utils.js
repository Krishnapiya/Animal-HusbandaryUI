const BASE_MAP_URL = import.meta.env.VITE_APP_BASE_MAP_URL;
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
import location_pin from "../maps/icons/location_pin.svg";
proj4.defs("EPSG:32643", "+proj=utm +zone=43 +datum=wgs84 +units=m +no_defs");
proj4.defs(
  "EPSG:4326",
  "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
);
register(proj4);
export const getFileNameWithoutExtension = (fileName) => {
  // Find the last dot in the file name
  const lastDotIndex = fileName.lastIndexOf(".");

  // If there is no dot, return the full file name
  if (lastDotIndex === -1) {
    return fileName;
  }

  // Extract the part of the string before the last dot
  return fileName.substring(0, lastDotIndex);
};

export const createForestWMSLayer = (title, layer) => {
  return new TileLayer({
    title: title,
    //minZoom:minzoom,
    //maxResolution:maxresolution,
    source: new TileWMS({
      url: BASE_MAP_URL + "forest/wms",
      params: { LAYERS: layer, TILED: true },
      serverType: "geoserver",
      crossOrigin: "anonymous",
      // Countries have transparency, so do not fade tiles:
      transition: 0,
      //projection:projection,
      // tileGrid: createXYZ({
      //   //extent: fullExtent,
      //   maxResolution: maxResolution,
      //   tileSize: tileSize,
      //   maxZoom: maxZoom
      // })
    }),
  });
};
const resolutions = [
  156543.03392804097, 78271.51696402048, 39135.75848201024, 19567.87924100512,
  9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282,
  611.49622628141, 305.7481131407, 152.87405657035, 76.43702828517,
  38.21851414258, 19.10925707129, 9.55462853564, 4.77731426782, 2.38865713391,
  1.19432856695, 0.59716428347, 0.29858214174,
];

const matrixIds = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
];
export const createForestWMTSLayer = (title, layer) => {
  ("createForestWMTSLayer");
  return new TileLayer({
    title: title,
    //minZoom:minzoom,
    //maxResolution:maxresolution,
    source: new WMTS({
      url: BASE_MAP_URL + "gwc/service/wmts",
      layer: layer,
      matrixSet: "EPSG:32643",
      format: "image/png",
      //projection: "EPSG:900913",
      tileGrid: new WMTSTileGrid({
        origin: [0, 0],
        resolutions: resolutions,
        matrixIds: matrixIds,
        tileSize: [256, 256],
      }),
      // style: "default"
    }),
  });
};
export const toggleTextScaleValue = (obj) => {
  const searchKey = "text-scale";
  const recursiveReplace = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        obj.forEach((item) => recursiveReplace(item)); // Recursively search within each item
      } else {
        Object.keys(obj).forEach((key) => {
          if (key.toLowerCase() === searchKey.toLowerCase()) {
            // Ignore case
            obj[key] = obj[key] ? 0 : 1; // Update the value
          }
          if (typeof obj[key] === "object") {
            recursiveReplace(obj[key]); // Recursively search in nested objects/arrays
          }
        });
      }
    }
  };

  recursiveReplace(obj);

  return obj; // Return the updated object
};

export const isTextScaleValueExist = (obj) => {
  const searchKey = "text-scale";
  let found = false; // Use a flag to track if the key is found
  const recursiveSearch = (obj) => {
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        // Recursively search within each item in the array
        for (const item of obj) {
          if (recursiveSearch(item)) return true; // Stop searching if key is found
        }
      } else {
        for (const key of Object.keys(obj)) {
          if (key.toLowerCase() === searchKey.toLowerCase()) {
            found = true;
            return true; // Return true immediately if key is found
          }
          if (typeof obj[key] === "object") {
            if (recursiveSearch(obj[key])) return true; // Recursively search in nested objects/arrays
          }
        }
      }
    }
    return false; // If nothing is found, return false
  };

  recursiveSearch(obj);
  return found; // Return the result of the search
};

export const countVisibleSearchLayersWithSameTitle = (map, title) => {
  const layer_array = map.getAllLayers();
  const search_layer_array = layer_array.filter(
    (layer) => layer.get("layer_category") === "search_layer",
  );
  const visible_search_layer_array = search_layer_array.filter((layer) =>
    layer.getVisible(),
  );
  const count = visible_search_layer_array.reduce(
    (acc, item) => (item.get("title") === title ? acc + 1 : acc),
    0,
  );
  return count;
};

//================================= STYLES FOR DRAWN LAYER===================================
const image = new Icon({
  opacity: 1,
  src: location_pin,
});
const styles = {
  Point: new Style({
    image: image,
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: "green",
      width: 3,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: "green",
      width: 3,
    }),
  }),
  MultiPoint: new Style({
    image: image,
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(255, 255, 0, 0.1)",
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  GeometryCollection: new Style({
    stroke: new Stroke({
      color: "magenta",
      width: 2,
    }),
    fill: new Fill({
      color: "magenta",
    }),
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
  Circle: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255,0,0,0.2)",
    }),
  }),
};

export const createDrawStyles = (feature) => {
  return styles[feature.getGeometry().getType()];
};
