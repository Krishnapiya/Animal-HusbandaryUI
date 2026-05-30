import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import useModal from "../../hooks/useModal";
import { useState } from "react";
import useDownloadExcel from "../../hooks/useDownloadExcel";
const XLSDownload = (props) => {
  const [selectedColumns, setSelectedColumns] = useState(props.tableColumns);
  const [open, handleOpen, handleClose] = useModal();
  const { downloadExcel } = useDownloadExcel(
    props.listURL,
    props.fetchParams,
    selectedColumns,
    props.fileName,
  );
  const handleXLSXDownload = () => {
    downloadExcel();
    //handleOnClose();
  };
  const handleToggle = (value) => () => {
    if (selectedColumns.includes(value)) {
      setSelectedColumns(selectedColumns.filter((val) => val != value));
    } else {
      setSelectedColumns([...selectedColumns, value]);
    }
  };
  const handleSelectAll = () => {
    if (selectedColumns == props.tableColumns) setSelectedColumns([]);
    else setSelectedColumns(props.tableColumns);
  };
  const handleOnClose = () => {
    setSelectedColumns(props.tableColumns);
    handleClose();
  };
  const handleOnOpen = () => {
    handleOpen();
  };

  return (
    <>
      <Tooltip title="Export Excel" placement="bottom">
        <IconButton onClick={handleOnOpen} color="error">
          <FileDownloadRoundedIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleOnClose} maxWidth="md">
        <DialogTitle>Select Columns to Export</DialogTitle>
        <DialogContent>
          {/* {props.tableColumns.map((item, index) => (
          <p key={index}>{item.header}</p>
        ))} */}

          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <ListItem disablePadding>
              <ListItemButton dense onClick={handleSelectAll}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    checked={selectedColumns == props.tableColumns}
                  />
                </ListItemIcon>
                <ListItemText primary={"Select All"} />
              </ListItemButton>
            </ListItem>
            {props.tableColumns.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(item)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedColumns.includes(item)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": index }}
                    />
                  </ListItemIcon>
                  <ListItemText id={index} primary={item.header} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} color="secondary" variant="contained">
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={selectedColumns.length === 0}
            onClick={handleXLSXDownload}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

XLSDownload.propTypes = {
  fetchParams: PropTypes.object,
  fileName: PropTypes.string,
  listURL: PropTypes.string,
  tableColumns: PropTypes.array,
};

export default XLSDownload;
