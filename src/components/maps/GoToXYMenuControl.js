import { Control } from "ol/control.js";
import "./control.css";
import goto_xy_icon from "./icons/goto_xy.svg";

export class GoToXYMenuControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = `<img src=${goto_xy_icon}  width="25" height="25">`;
    button.title = "GoTo XY";
    const element = document.createElement("div");
    element.className = "gotoxy-menu ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", opt_options.listener.bind(this), false);
  }
}
