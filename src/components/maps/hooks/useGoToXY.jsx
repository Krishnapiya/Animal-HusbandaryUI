import { useState, useEffect } from "react";
import GoToXYMenu from "../../../pages/map/GoToXYMenu";
const useGoToXY = (map) => {
  const [goToXYlayer, setGoToXYlayer] = useState(null);
  const [anchorElGotoXY, setAnchorElGotoXY] = useState(null);

  useEffect(() => {
    if (map && goToXYlayer) {
      map.addLayer(goToXYlayer);
      map.getView().fit(goToXYlayer.getSource().getExtent(), {
        maxZoom: 12,
        duration: 1500,
        padding: [20, 20, 20, 20],
        //callback: setZoomAfterAnimation(),
      });
      return () => {
        // map.removeLayer(goToXYlayer);
        goToXYlayer.setVisible(false);
      };
    }
  }, [goToXYlayer]);
  const handleGoToXYClick = (event) => {
    setAnchorElGotoXY(event.currentTarget);
  };
  const handleGoTOXYClose = () => {
    setAnchorElGotoXY(null);
  };
  const UIComponent = () => (
    <GoToXYMenu
      anchorEl={anchorElGotoXY}
      handleClose={handleGoTOXYClose}
      container={map?.getTarget()}
      setGoToXYlayer={setGoToXYlayer}
      goToXYlayer={goToXYlayer}
    />
  );
  return { UIComponent, handleGoToXYClick };
};

export default useGoToXY;
