import { Control } from "ol/control.js";
import "./control.css";
import menu_icon from "./icons/layer_switcher.svg";

export class LayerControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = `<img src=${menu_icon}  width="25" height="25">`;
    button.title = "Layer Switcher";
    const element = document.createElement("div");
    element.className = "layerswitcher-menu ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", opt_options.listener.bind(this), false);
  }
}
