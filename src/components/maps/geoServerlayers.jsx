const BASE_MAP_URL = import.meta.env.VITE_APP_BASE_MAP_URL;
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
//import OSM from "ol/source/OSM";
//import { createForestWMTSLayer } from "./utils";
import TileGrid from "ol/tilegrid/TileGrid";
import { get as getProjection } from "ol/proj";
import { getWidth } from "ol/extent";
//import LayerGroup from "ol/layer/Group";
const projection = getProjection("EPSG:900913");
const extent = projection.getExtent();
const tileSize = 256;

// Define the resolutions based on the extent and tile size
const resolutions = [];
for (let z = 0; z <= 18; ++z) {
  resolutions[z] = getWidth(extent) / (tileSize * Math.pow(2, z));
}

// const osm = new TileLayer({
//   title: "OSM",
//   source: new OSM(),
//   layer_category: "geoserver_layer",
//   opacity: 0.1
// });
const createTilelayer = (title, layer) => {
  return new TileLayer({
    title: title,
    layer_category: "geoserver_tile_layer",
    //type: "base",
    source: new XYZ({
      url:
        BASE_MAP_URL +
        "gwc/service/tms/1.0.0/" +
        layer +
        "@EPSG%3A900913@png/{z}/{x}/{-y}.png",
      crossOrigin: "anonymous",
      tileGrid: new TileGrid({
        extent: extent,
        resolutions: resolutions,
        tileSize: tileSize,
      }),
    }),
  });
};
// const circles = createTilelayer("Circles", "forest:circles");
// const divisions = createTilelayer("Divisions", "forest:divisions");
// const range = createTilelayer("Range", "forest:ranges");
// const stations = createTilelayer("Station", "forest:stations");
// export const forestJurisdictionLayer = new LayerGroup({
//   type: "base",
//   title: "Department layers",
//   layer_category: "geoserver_layer",
//   layers: [osm, circles, divisions, range, stations]
// });
export const forestJurisdictionLayer = createTilelayer(
  "Forest Jurisdiction",
  "forest:forest_all_jurisdictions",
);
export const districtLayer = createTilelayer("Districts", "forest:district");
