import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
const ImageGalleryDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    //if (reason && reason == "backdropClick") return;
    props.setImageArray([]);
    setOpen(false);
  };
  useEffect(() => {
    if (props.imageArray.length) {
      const imgs = props.imageArray.map((item) => ({
        original: item.image,
        thumbnail: item.thumbnails,
      }));
      setImages(imgs);
      handleOpen();
    }
  }, [props.imageArray]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <ImageGallery items={images} />
        </DialogContent>
      </Dialog>
    </>
  );
};

ImageGalleryDialog.propTypes = {
  imageArray: PropTypes.array,
  setImageArray: PropTypes.func,
};

export default ImageGalleryDialog;
