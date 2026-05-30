import { Control } from "ol/control.js";
import "./control.css";
import clear_canvas_icon from "./icons/clear_canvas.svg";
import measure_area_icon from "./icons/measure_area.svg";
import measure_line_icon from "./icons/measure_line.svg";
import measure_stop_icon from "./icons/measure_stop.svg";
export class clearCanvasControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = `<img src=${clear_canvas_icon}  width="25" height="25">`;
    button.title = "Clear Measurements";
    const element = document.createElement("div");
    //element.style.display = "none"; //will be active when Area/length is enabled
    element.className = "clear-canvas ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", opt_options.listener.bind(this), false);
  }
}
export class areaFinderControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = `<img src=${measure_area_icon}  width="25" height="25">`;
    button.title = "Measure Area";
    const element = document.createElement("div");
    element.className = "area-finder ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", opt_options.listener.bind(this), false);
  }
}
export class lengthFinderControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = `<img src=${measure_line_icon}  width="25" height="25">`;
    button.title = "Measure Length";
    const element = document.createElement("div");
    element.className = "length-finder ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", opt_options.listener.bind(this), false);
  }
}
export class disableMeasureControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = `<img src=${measure_stop_icon}  width="25" height="25">`;
    button.title = "Stop Measure Tools";
    const element = document.createElement("div");
    element.className = "disable-measure ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", opt_options.listener.bind(this), false);
  }
}
