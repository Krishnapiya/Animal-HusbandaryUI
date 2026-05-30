import { useEffect, useState } from "react";
import Draw from "ol/interaction/Draw.js";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { LineString, Polygon } from "ol/geom.js";
import { getArea, getLength } from "ol/sphere.js";
import { unByKey } from "ol/Observable.js";
import "ol/ol.css";
import { Vector as VectorSource } from "ol/source.js";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";
import "./tooltip.css";
import { active_button_color } from "./constants";
const measure_area_element = document.getElementsByClassName("area-finder");
const measure_length_element = document.getElementsByClassName("length-finder");
const MapMeasuring = (map) => {
  const source = new VectorSource();
  const [drawType, setDrawType] = useState(null);
  const [clearCanvas, setClearCanvas] = useState(false);
  const handleClearCanvas = () => {
    setClearCanvas(true);
  };
  const handleAreaFinder = () => {
    measure_area_element[0].children[0].style.setProperty(
      "background-color",
      active_button_color,
    );
    measure_length_element[0].children[0].style.removeProperty(
      "background-color",
    );
    setDrawType("Polygon");
  };
  const handleLengthFinder = () => {
    measure_area_element[0].children[0].style.removeProperty(
      "background-color",
    );
    measure_length_element[0].children[0].style.setProperty(
      "background-color",
      active_button_color,
    );
    setDrawType("LineString");
  };
  const handleDisableMeasure = () => {
    measure_area_element[0].children[0].style.removeProperty(
      "background-color",
    );
    measure_length_element[0].children[0].style.removeProperty(
      "background-color",
    );
    setDrawType(null);
  };
  const vector = new VectorLayer({
    source: source,
    //title: "Measurement",
    style: {
      "fill-color": "rgba(255, 255, 255, 0.2)",
      "stroke-color": "#ffcc33",
      "stroke-width": 2,
      "circle-radius": 7,
      "circle-fill-color": "#ffcc33",
    },
  });
  let sketch;
  let helpTooltipElement;
  let helpTooltip;
  let measureTooltipElement;
  let measureTooltip;
  const continuePolygonMsg = "Click to continue drawing the polygon";
  const continueLineMsg = "Click to continue drawing the line";
  let draw;
  const pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }

    let helpMsg = "Click to start drawing";

    if (sketch) {
      const geom = sketch.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = continuePolygonMsg;
      } else if (geom instanceof LineString) {
        helpMsg = continueLineMsg;
      }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    helpTooltipElement.classList.remove("hidden");
  };
  function createHelpTooltip() {
    if (helpTooltipElement) {
      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement("div");
    helpTooltipElement.className = "ol-tooltip hidden";
    helpTooltip = new Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    map.addOverlay(helpTooltip);
  }
  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement("div");
    measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureTooltip = new Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      insertFirst: false,
    });
    map.addOverlay(measureTooltip);
  }

  const formatLength = function (line) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }
    return output;
  };

  const formatArea = function (polygon) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output =
        Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return output;
  };
  function addInteraction(type) {
    //const type = "LineString"; //typeSelect.value == "area" ? "Polygon" : "LineString";
    draw = new Draw({
      source: source,
      type: type,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.5)",
          lineDash: [10, 10],
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.7)",
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
        }),
      }),
    });
    map.addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

    let listener;
    let geom;
    draw.on("drawstart", function (evt) {
      // set sketch

      sketch = evt.feature;

      let tooltipCoord = evt.coordinate;
      let segment_count;
      if (drawType == "Polygon") {
        segment_count = 3;
      } else {
        segment_count = 2;
      }

      listener = sketch.getGeometry().on("change", function (evt) {
        geom = evt.target;
        let output;
        let current_segment_count = segment_count;
        let current_segment;
        let first_index;
        let second_index;
        if (geom instanceof Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
          current_segment = geom.getCoordinates()[0];
          first_index = 2;
          second_index = 3;
        } else if (geom instanceof LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
          current_segment = geom.getCoordinates();
          first_index = 1;
          second_index = 2;
        }
        current_segment_count = current_segment.length;

        if (current_segment_count > segment_count) {
          let last_segment = new LineString([
            current_segment[segment_count - first_index],
            current_segment[segment_count - second_index],
          ]);
          let inter_tooltipCoord = last_segment.getCoordinateAt(0.5);
          let segment_length = formatLength(last_segment);

          measureTooltipElement.innerHTML = segment_length;
          measureTooltip.setPosition(inter_tooltipCoord);
          measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
          measureTooltip.setOffset([0, -7]);
          measureTooltipElement = null;
          createMeasureTooltip();
          segment_count = current_segment_count;
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });

    draw.on("drawend", function () {
      measureTooltipElement.className = "ol-tooltip ol-tooltip-final";
      measureTooltip.setOffset([0, -7]);
      // unset sketch
      sketch = null;
      // unset tooltip so that a new one can be created
      measureTooltipElement = null;
      createMeasureTooltip();
      if (geom instanceof Polygon) {
        let coord_arr = geom.getCoordinates()[0];
        let last_segment = new LineString([
          geom.getFirstCoordinate(),
          coord_arr[coord_arr.length - 2],
        ]);
        let inter_tooltipCoord = last_segment.getCoordinateAt(0.5);
        let segment_length = formatLength(last_segment);
        measureTooltipElement.innerHTML = segment_length;
        measureTooltip.setPosition(inter_tooltipCoord);
        measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureTooltip.setOffset([0, -7]);
        measureTooltipElement = null;
        createMeasureTooltip();
      }
      unByKey(listener);
    });
  }
  useEffect(() => {
    if (!map) return;
    if (!drawType && map) {
      map.removeLayer(vector);
      return;
    }
    map.addLayer(vector);
    vector.set("layer_id", 222); //just a random value
    const pointer_move_event = map.on("pointermove", pointerMoveHandler);
    const pointer_mouse_out = map
      .getViewport()
      .addEventListener("mouseout", function () {
        helpTooltipElement.classList.add("hidden");
      });
    //map.removeInteraction(draw);
    addInteraction(drawType);

    return () => {
      map.removeInteraction(draw);
      unByKey(pointer_move_event);
      unByKey(pointer_mouse_out);
    };
  }, [drawType, map]);
  useEffect(() => {
    if (clearCanvas) {
      setClearCanvas(false);
      if (map) {
        map
          .getLayers()
          .getArray()
          .slice()
          .forEach((layer) => {
            try {
              if (layer.get("layer_id") == 222) {
                layer.getSource().clear();
                //map.removeLayer(layer);
              }
            } catch (error) {
              console.error(error);
            }
          });
        const ol_tooltip_static =
          document.querySelectorAll(".ol-tooltip-static");
        for (const el of ol_tooltip_static) {
          el.parentNode.removeChild(el);
        }
        const ol_tooltip_final = document.querySelectorAll(".ol-tooltip-final");
        for (const el of ol_tooltip_final) {
          el.parentNode.removeChild(el);
        }
      }
    }
  }, [clearCanvas]);

  return {
    handleLengthFinder,
    handleAreaFinder,
    handleDisableMeasure,
    handleClearCanvas,
  };
};

export default MapMeasuring;
