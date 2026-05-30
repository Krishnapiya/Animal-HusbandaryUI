import "ol-contextmenu/dist/ol-contextmenu.css";
import { defaults as defaultControls } from "ol/control";
import MousePosition from "ol/control/MousePosition";
import { createStringXY, toStringXY } from "ol/coordinate";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import PrintDialog from "ol-ext/control/PrintDialog";
import CanvasTitle from "ol-ext/control/CanvasTitle";
import Notification from "ol-ext/control/Notification";
import CanvasScaleLine from "ol-ext/control/CanvasScaleLine";
import Toggle from "ol-ext/control/Toggle";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { Style, Text } from "ol/style";
import "ol-ext/dist/ol-ext.css";
import { always } from "ol/events/condition";
import DragZoom from "ol/interaction/DragZoom";
import ZoomToExtent from "ol/control/ZoomToExtent.js";
import FullScreen from "ol/control/FullScreen";
import globe_icon from "./icons/globe.svg";
import extend_icon from "./icons/extend.svg";
import { active_button_color } from "./constants";
import ContextMenu from "ol-contextmenu";
import { copyToClipboard } from "../../utils/copyToClipBoard";
import { toLonLat } from "ol/proj";
import location_icon from "./icons/location_icon_png.png";
import { keralaExtend } from "./keralaExtend";
import forest_logo from "./icons/logo.png";
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: "EPSG:4326",
  //className: "custom-mouse-position",
});
const scaleLineControl = new CanvasScaleLine({ steps: 8 });
const notificationControl = new Notification({ closeBox: true });

const contextMenuControl = new ContextMenu({
  width: 150,
  defaultItems: true,
});
const handleCopyToClipboard = async (evt) => {
  const lon_lat = toLonLat(evt.coordinate);
  const coordText = toStringXY(lon_lat, 4);
  const isSuccess = await copyToClipboard(coordText);
  if (isSuccess) notificationControl.show("Copied to Clip Board !!");
  else notificationControl.show("Error in Copying");
  return;
};
contextMenuControl.on("open", function (evt) {
  const lon_lat = toLonLat(evt.coordinate);
  const coordText = toStringXY(lon_lat, 4);
  const lat_lon_menu = {
    text: coordText,
    icon: location_icon,
    callback: handleCopyToClipboard,
  };
  contextMenuControl.push(lat_lon_menu);
});
contextMenuControl.on("close", function (evt) {
  if (evt.target.menuEntries.size > 2) contextMenuControl.pop();
});
const printControl = new PrintDialog({ quality: 1, print: { margin: 5 } });
printControl.setSize("A4");
printControl.setOrientation("landscape");
printControl.on(["print", "error"], function (e) {
  // Print success
  if (e.image) {
    if (e.pdf) {
      // Export PDF with a border
      var pdf = new jsPDF({
        orientation: e.print.orientation,
        unit: e.print.unit,
        format: e.print.size,
      });

      // Set border width and color
      var borderWidth = 1; // in units used by jsPDF
      var borderColor = "#000000"; // black

      // Draw border (rectangle)
      pdf.setLineWidth(borderWidth);
      pdf.setDrawColor(borderColor);
      pdf.rect(
        e.print.position[0] - borderWidth,
        e.print.position[1] - borderWidth,
        e.print.imageWidth + 2 * borderWidth,
        e.print.imageHeight + 2 * borderWidth,
      );
      // Add the image
      pdf.addImage(
        e.image,
        "JPEG",
        e.print.position[0],
        e.print.position[1],
        e.print.imageWidth,
        e.print.imageHeight,
      );
      var footerText =
        "This map is purely for forest management purpose and cannot be used for forest boundary dispute or any legal purpose";
      var pageWidth = pdf.internal.pageSize.width;
      var pageHeight = pdf.internal.pageSize.height;
      var textWidth = pdf.getTextWidth(footerText);
      var footerXPosition = pageWidth - textWidth + 105; // Position 10 units from the right edge
      var footerYPosition = pageHeight - 1; // Position 10 units from the bottom

      pdf.setFontSize(10);
      pdf.text(footerText, footerXPosition, footerYPosition);
      var footerImage = forest_logo; // Path to your footer image
      var footerImageWidth = 24; // Set the desired width for the footer image
      var footerImageHeight = 16; // Set the desired height for the footer image
      var imageXPosition = pageWidth - borderWidth - footerImageWidth; // Position 10 units from the right edge
      var imageYPosition = pageHeight - borderWidth - footerImageHeight - 15; // Position above the text

      pdf.addImage(
        footerImage,
        "PNG",
        imageXPosition,
        imageYPosition,
        footerImageWidth,
        footerImageHeight,
      );

      pdf.save(e.print.legend ? "legend.pdf" : "map.pdf");
    } else {
      // Add a border to the canvas before saving the image
      const context = e.canvas.getContext("2d");
      const borderWidth = 10; // in pixels
      const borderColor = "#000000"; // black

      // Draw border (rectangle)
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.strokeRect(0, 0, e.canvas.width, e.canvas.height);

      // Save image as file
      e.canvas.toBlob(
        function (blob) {
          var name =
            (e.print.legend ? "legend." : "map.") +
            e.imageType.replace("image/", "");
          saveAs(blob, name);
        },
        e.imageType,
        e.quality,
      );
    }
  } else {
    console.warn("No canvas to export");
  }
});

const canvasTitle = new CanvasTitle({
  title: "",
  visible: false,
  style: new Style({
    text: new Text({
      font: "20px 'Lucida Grande',Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif",
    }),
  }),
});
const dragZoom = new DragZoom({ condition: always, duration: 1500 });
const dragZoomOnToggle = (isActive) => {
  const drag_zoom_element = document.getElementsByClassName("drag-zoom");
  if (isActive) {
    drag_zoom_element[0].children[0].style.setProperty(
      "background-color",
      active_button_color,
    );
  } else {
    drag_zoom_element[0].children[0].style.removeProperty("background-color");
  }
};
const drag_zoom_label = document.createElement("img");
drag_zoom_label.width = 30;
drag_zoom_label.height = 30;
drag_zoom_label.src = extend_icon;
const toggleDragZoomControl = new Toggle({
  html: drag_zoom_label,
  className: "drag-zoom ol-unselectable ol-control",
  title: "Drag Zoom",
  interaction: dragZoom,
  onToggle: dragZoomOnToggle,
});
const fit_to_extend_label = document.createElement("img");
fit_to_extend_label.width = 30;
fit_to_extend_label.height = 30;
fit_to_extend_label.src = globe_icon;
const zoomToExtendControl = new ZoomToExtent({
  label: fit_to_extend_label,
  extent: keralaExtend,
  tipLabel: "Fit to Kerala",
});
const fullScreenControl = new FullScreen();
export const map_controls = defaultControls({ attribution: false }).extend([
  mousePositionControl,
  scaleLineControl,
  // layerSwitcher,
  printControl,
  canvasTitle,
  toggleDragZoomControl,
  zoomToExtendControl,
  fullScreenControl,
  notificationControl,
  contextMenuControl,
]);
export const clearContextMenu = () => {
  contextMenuControl.clear();
};
