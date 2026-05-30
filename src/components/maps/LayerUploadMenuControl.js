import { Control } from "ol/control.js";
import "./control.css";
import upload_icon from "./icons/upload.svg";

export class LayerUploadMenuControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = `<img src=${upload_icon}  width="25" height="25">`;
    button.title = "Upload Layer";
    const element = document.createElement("div");
    element.className = "layer-upload-menu ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", opt_options.listener.bind(this), false);
  }
}
