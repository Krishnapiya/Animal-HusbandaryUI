import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import Map from "ol/Map";
import View from "ol/View";
import LayerSwitcher from "ol-layerswitcher";
import { defaults as defaultControls } from "ol/control";
import { useState, useEffect, useRef } from "react";
import { initialLayers } from "../maps/initial_layers";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import { toLonLat, fromLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import { Fill, Stroke, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import FontSymbol from "ol-ext/style/FontSymbol";
import Shadow from "ol-ext/style/Shadow";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
proj4.defs("EPSG:32643", "+proj=utm +zone=43 +datum=wgs84 +units=m +no_defs");
proj4.defs(
  "EPSG:4326",
  "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
);
register(proj4);

const MapInput = (props) => {
  const [map, setMap] = useState(null); // eslint-disable-line
  const [lonLat, setLonLat] = useState([]);
  const [pointLayer, setPointLayer] = useState(null);
  const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: "EPSG:4326",
    //className: "custom-mouse-position",
  });
  // const mapRef = useRef();
  const mapElement = useRef();
  // mapRef.current = map;
  useEffect(() => {
    const initMap = new Map({
      target: mapElement.current,
      controls: defaultControls({ attribution: false }).extend([
        mousePositionControl,
      ]),
      layers: initialLayers,
      view: new View({
        center: fromLonLat([76.49, 10.54]),
        zoom: 12,
      }),
    });
    //const initMap = mapElement.current;
    var layerSwitcher = new LayerSwitcher({
      reverse: false,

      //groupSelectStyle: 'group',
    });
    initMap.addControl(layerSwitcher);
    // mapElement.current = initMap;
    setMap(initMap);
    initMap.on("singleclick", function (e) {
      const lon_lat = toLonLat(e.coordinate);
      setLonLat(lon_lat);
    });
    //initMap.addOverlay(popup);
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<INITIAL MAP ENDS HERE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    setMap(initMap);
    return () => {
      initMap.dispose();
    };
  }, []);
  useEffect(() => {
    if (lonLat.length == 2) props.handleChangeLocation(lonLat[0], lonLat[1]);
  }, [lonLat]);
  useEffect(() => {
    if (props.latitude && props.longitude) {
      const pnt_cords = fromLonLat([
        parseFloat(props.longitude),
        parseFloat(props.latitude),
      ]);
      if (map) map.getView().setCenter(pnt_cords);
      const pnt_lyr = new VectorLayer({
        title: "POI",
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point(pnt_cords),
            }),
          ],
        }),
        style: [
          new Style({
            image: new FontSymbol({
              form: "poi",
              gradient: true,
              radius: 20,
              rotation: 0,
              glyph: "",
              text: "O",
              stroke: new Stroke({ color: "darkred", width: 2 }),
              fill: new Fill({ color: "yellow" }),
              displacement: [0, 20], //20:same as radius
            }),
          }),
          new Style({
            image: new Shadow({
              radius: 15,
              blur: 5,
              offsetX: 0,
              offsetY: 0,
              fill: new Fill({
                color: "rgba(0,0,0,0.5)",
              }),
            }),
          }),
        ],
      });
      setPointLayer(pnt_lyr);
    } else {
      if (pointLayer) map.removeLayer(pointLayer);
    }
  }, [props.latitude, props.longitude]);
  useEffect(() => {
    if (!map) return;
    map.addLayer(pointLayer);
    return () => {
      map.removeLayer(pointLayer);
    };
  }, [pointLayer]);

  return (
    <Box
      ref={mapElement}
      sx={{
        height: props.height || "40vh",
        width: "100%",
        border: "1px solid",
        borderColor: "text.disabled",
      }}
    ></Box>
  );
};

MapInput.propTypes = {
  handleChangeLocation: PropTypes.func,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  height: PropTypes.string,
};

export default MapInput;
