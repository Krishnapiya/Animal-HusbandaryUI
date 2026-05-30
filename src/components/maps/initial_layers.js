import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Graticule from "ol/layer/Graticule.js";
import Stroke from "ol/style/Stroke.js";

import { forestJurisdictionLayer, districtLayer } from "./geoServerlayers";
const osm = new TileLayer({
  title: "OSM",
  type: "base",
  source: new OSM({ attributions: "" }),
});
const gmap1 = new TileLayer({
  title: "Google map (satellite)",
  type: "base",
  source: new XYZ({
    url: "https://mt{0-3}.google.com/vt/?lyrs=y&x={x}&y={y}&z={z}",
  }),
});
const gmap2 = new TileLayer({
  title: "Google map (m)",
  type: "base",
  source: new XYZ({
    url: "https://mt{0-3}.google.com/vt/?lyrs=m&x={x}&y={y}&z={z}",
  }),
});
const gmap3 = new TileLayer({
  title: "Google map (m,traffic)",
  type: "base",
  source: new XYZ({
    url: "https://mt{0-3}.google.com/vt/?lyrs=m,traffic&x={x}&y={y}&z={z}",
  }),
});
const grid = new Graticule({
  // the style to use for the lines, optional.
  title: "Grid Lines",
  layer_category: "grid_layer",
  visible: false,
  strokeStyle: new Stroke({
    color: "rgba(255,120,0,0.9)",
    width: 2,
    lineDash: [0.5, 4],
  }),
  showLabels: true,
  wrapX: false,
});
export const initialLayers = [
  gmap1,
  gmap3,
  gmap2,
  osm,
  grid,
  districtLayer,
  forestJurisdictionLayer,
];
