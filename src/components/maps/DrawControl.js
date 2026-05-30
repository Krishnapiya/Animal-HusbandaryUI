import { Control } from "ol/control.js";
import "./control.css";
import icon from "./icons/draw_icon.svg";

export class DrawControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = `<img src=${icon}  width="25" height="25">`;
    button.title = "Draw Geometry";
    const element = document.createElement("div");
    element.className = "draw-control ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", opt_options.listener.bind(this), false);
  }
}
