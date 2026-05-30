import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PDFViewer from "./PDFViewer";
const PDFViewerDialog = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    props.setPdfUrl("");
    setOpen(false);
  };
  useEffect(() => {
    if (props.pdfUrl) {
      handleOpen();
    }
  }, [props.pdfUrl]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogContent sx={{ height: "100vh" }}>
          <PDFViewer pdfFile={props.pdfUrl} />
        </DialogContent>
      </Dialog>
    </>
  );
};

PDFViewerDialog.propTypes = {
  pdfUrl: PropTypes.array,
  setPdfUrl: PropTypes.func,
};

export default PDFViewerDialog;
