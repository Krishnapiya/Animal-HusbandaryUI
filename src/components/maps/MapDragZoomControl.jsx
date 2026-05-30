import { Control } from "ol/control.js";

export class MapDragZoomControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */

  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement("button");
    button.title = "Drag Zoom";
    button.innerHTML = "N";

    const element = document.createElement("div");
    element.className = "rotate-north ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });
    button.addEventListener("click", this.handleDragZoom.bind(this), false);
  }

  handleDragZoom() {
    // this.getMap().addInteraction(dragZoom);
    const interactions = this.getMap().getInteractions();
  }
}
