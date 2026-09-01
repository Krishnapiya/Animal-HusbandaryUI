import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import HistoryIcon from "@mui/icons-material/History";
import { toast } from "material-react-toastify";
import { getItemList } from "../api-client/apiCall";
import { REGISTRATION_APPLICATION_STATUS_HISTORY_API_URL } from "../config/endpoints";

const upperStatus = (value) =>
  value == null || value === ""
    ? "-"
    : String(value).replace(/\+/g, " ").replace(/_/g, " ").toUpperCase();

const PetShopStatusHistoryDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.setApplicationId("");
    setOpen(false);
    setHistoryData([]);
  };

  const fetchHistory = useCallback(async () => {
    if (!props.applicationId) return;

    setIsLoading(true);

    try {
      const apiUrl = `${REGISTRATION_APPLICATION_STATUS_HISTORY_API_URL}${props.applicationId}`;
      const response = await getItemList(apiUrl, {});

      if (response.isSuccess) {
        const data =
          response.data?.payLoad ||
          response.data?.content ||
          response.data ||
          [];

        setHistoryData(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to load status history");
        setHistoryData([]);
      }
    } catch (error) {
      console.error("Error fetching status history:", error);
      toast.error("Error loading status history");
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  }, [props.applicationId]);

  useEffect(() => {
    if (props.applicationId) {
      handleOpen();
      fetchHistory();
    }
  }, [props.applicationId, fetchHistory]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";

    try {
      const date =
        typeof timestamp === "number"
          ? new Date(timestamp)
          : new Date(timestamp);

      if (isNaN(date.getTime())) return "-";

      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HistoryIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" component="span">
            Application Status History
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : historyData.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No status history available.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {historyData.map((item, index) => (
              <Box key={item.id || index} sx={{ display: "flex", gap: 2, position: "relative" }}>
                <Box sx={{ width: 24, display: "flex", justifyContent: "center", position: "relative" }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mt: 1,
                      zIndex: 1,
                    }}
                  />
                  {index < historyData.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 18,
                        width: 2,
                        bottom: -18,
                        bgcolor: "divider",
                      }}
                    />
                  )}
                </Box>
                <Paper variant="outlined" sx={{ p: 1.5, flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {upperStatus(item.actionType || "Status changed")}
                    </Typography>
                    <Chip label={formatDate(item.changedAt)} size="small" variant="outlined" />
                  </Stack>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                    <Chip size="small" label={`FROM: ${upperStatus(item.fromStatus)}`} variant="outlined" />
                    <Chip size="small" color="primary" label={`TO: ${upperStatus(item.toStatus)}`} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Changed by: {item.changedBy || "-"}
                  </Typography>
                  {item.remarks ? (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Remarks: {item.remarks}
                    </Typography>
                  ) : null}
                </Paper>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PetShopStatusHistoryDialog.propTypes = {
  applicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  setApplicationId: PropTypes.func.isRequired,
};

export default PetShopStatusHistoryDialog;