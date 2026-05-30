import { Control } from "ol/control";
import { createRoot } from "react-dom/client";
import OLAPlaceSearch from "../FormComponents/OLAPlaceSearch";
class MapSearchControl extends Control {
  constructor(options) {
    const container = document.createElement("div");
    container.className = "place-search-textbox ";
    super({ element: container });
    const root = createRoot(container);
    root.render(
      <OLAPlaceSearch
        disablePortal={true}
        handleChangeLocation={options.listener.bind(this)}
      />,
    );
  }
}

export default MapSearchControl;
