import PropTypes from "prop-types";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
const PDFViewer = ({ pdfFile }) => {
  const zoomPluginInstance = zoomPlugin();
  const { zoomTo } = zoomPluginInstance;
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  return (
    <div
      className="rpv-core__viewer"
      style={{ height: "800px", width: "100%", position: "relative" }}
    >
      {/* Add zoom controls at the top */}
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#eeeeee",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          display: "flex",
          padding: "4px",
        }}
      >
        <Toolbar />
      </div>

      {/* PDF Worker */}
      <Worker workerUrl={"/pdf.worker.min.mjs"}>
        {pdfFile && (
          <Viewer
            fileUrl={pdfFile}
            plugins={[zoomPluginInstance, toolbarPluginInstance]} // Add zoom plugin
            onDocumentLoad={() => {
              zoomTo(SpecialZoomLevel.PageFit); // Zoom to fit the page when the document is loaded
            }}
          />
        )}
      </Worker>
    </div>
  );
};

PDFViewer.propTypes = {
  pdfFile: PropTypes.string,
};

export default PDFViewer;
