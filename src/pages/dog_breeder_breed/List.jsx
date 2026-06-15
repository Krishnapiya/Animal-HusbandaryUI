import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import EditButton from "../../components/button/EditButton";
import DeleteButton from "../../components/button/DeleteButton";
import DeleteDialog from "../../components/DeleteDialog";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { assignRoles, getAssignedRoles } from "../../api-client/users";
import { toast } from "material-react-toastify";

const List = (props) => {
  const [deleteRowID, setDeleteRowID] = useState("");
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [officeRoleGroups, setOfficeRoleGroups] = useState([]);
  const [draftOfficeId, setDraftOfficeId] = useState("");
  const [draftRoleIds, setDraftRoleIds] = useState([]);

  const roleList = props.dropDownLists?.role || [];
  const officeList = props.dropDownLists?.office || [];

  const handleOpenAssignRoles = async (userId) => {
    setSelectedUserId(userId);
    const offices = props.dropDownLists?.office || [];
    setDraftOfficeId(offices[0]?.id != null ? String(offices[0].id) : "");
    setDraftRoleIds([]);
    setOpenRoleDialog(true);
    const response = await getAssignedRoles(userId);
    if (response?.isSuccess) {
      const payload = response?.data?.payLoad ?? response?.data?.payload ?? {};
      let groups = payload.officeRoleGroups;
      if (Array.isArray(groups)) {
        groups = groups.filter((g) => g.officeId != null);
      } else {
        groups = [];
      }
      setOfficeRoleGroups(groups.map((g) => ({ ...g, roleIds: [...(g.roleIds || [])] })));
    } else {
      setOfficeRoleGroups([]);
    }
  };

  const roleNamesForIds = (ids) =>
    roleList
      .filter((r) => ids.map(Number).includes(Number(r.id)))
      .map((r) => r.name)
      .join(", ");

  const officeLabel = (officeId, officeName) => {
    if (officeName) return officeName;
    const o = officeList.find((x) => Number(x.id) === Number(officeId));
    return o?.name || `Office #${officeId}`;
  };

  const handleAddGroup = () => {
    if (!draftOfficeId) {
      toast.warning("Select an office.");
      return;
    }
    if (!draftRoleIds.length) {
      toast.warning("Select at least one role.");
      return;
    }
    const officeId = Number(draftOfficeId);
    const name = officeList.find((x) => Number(x.id) === officeId)?.name ?? null;
    setOfficeRoleGroups((prev) => {
      const idx = prev.findIndex((g) => Number(g.officeId) === Number(officeId));
      if (idx >= 0) {
        const next = [...prev];
        const merged = [...new Set([...next[idx].roleIds.map(Number), ...draftRoleIds.map(Number)])];
        next[idx] = { ...next[idx], roleIds: merged };
        return next;
      }
      return [...prev, { officeId, officeName: name, roleIds: [...draftRoleIds.map(Number)] }];
    });
    setDraftRoleIds([]);
  };

  const handleRemoveGroup = (index) => {
    setOfficeRoleGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRoles = async () => {
    const body = {
      officeRoleGroups: officeRoleGroups.map((g) => ({
        officeId: g.officeId ?? null,
        roleIds: (g.roleIds || []).map(Number),
      })),
    };
    const response = await assignRoles(selectedUserId, body);
    if (response?.isSuccess) {
      toast.success("Roles assigned successfully");
      if (typeof props.loadRoleAssignments === "function") {
        await props.loadRoleAssignments();
      }
      setOpenRoleDialog(false);
      return;
    }
    toast.error("Failed to assign roles");
  };

  return (
    <>
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {props.tableColumns.map((col, index) => (
              <TableCell key={index}>
                <TableSortLabel
                  onClick={props.handleSortClick(col.attr)}
                  active={col.attr === props.sortAttributeDirection.attr}
                  direction={
                    col.attr === props.sortAttributeDirection.attr
                      ? props.sortAttributeDirection.direction
                      : "asc"
                  }
                >
                  {col.header}
                </TableSortLabel>
              </TableCell>
            ))}
            {props.canEdit ? <TableCell>Edit</TableCell> : null}
            {props.canAssignRoles ? <TableCell>Assign Roles</TableCell> : null}
            {props.canDelete ? <TableCell>Delete</TableCell> : null}
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow key={index}>
              {props.tableColumns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {typeof col.render === "function" ? col.render(row) : row[col.attr]}
                </TableCell>
              ))}
              {props.canEdit ? (
                <TableCell>
                  <EditButton onClick={() => props.handleEditClick(row.id)} />
                </TableCell>
              ) : null}
              {props.canAssignRoles ? (
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => handleOpenAssignRoles(row.id)}>
                    Assign Roles
                  </Button>
                </TableCell>
              ) : null}
              {props.canDelete ? (
                <TableCell>
                  <DeleteButton onClick={() => setDeleteRowID(row.id)} />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteDialog
        id={deleteRowID}
        api_url={props.api_url}
        alertString={props.alertString}
        setID={setDeleteRowID}
        handleRefreshTable={props.handleRefreshTable}
      />
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>Assign roles by office</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Choose an office and roles, then Add. Repeat for other offices. Save replaces all assignments for this
            user. Every role must belong to an office.
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: "flex-start", mb: 2 }}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel id="draft-office-label">Office</InputLabel>
              <Select
                labelId="draft-office-label"
                label="Office"
                value={draftOfficeId}
                onChange={(e) => setDraftOfficeId(e.target.value)}
                displayEmpty
              >
                {officeList.length === 0 ? (
                  <MenuItem value="" disabled>
                    No offices loaded
                  </MenuItem>
                ) : null}
                {officeList.map((o) => (
                  <MenuItem key={o.id} value={String(o.id)}>
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: 220 }}>
              <InputLabel id="draft-roles-label">Roles</InputLabel>
              <Select
                labelId="draft-roles-label"
                multiple
                value={draftRoleIds}
                label="Roles"
                onChange={(e) => setDraftRoleIds(e.target.value)}
                renderValue={(selected) =>
                  roleList
                    .filter((role) => selected.map(Number).includes(Number(role.id)))
                    .map((role) => role.name)
                    .join(", ")
                }
              >
                {roleList.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Checkbox checked={draftRoleIds.map(Number).includes(Number(role.id))} />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleAddGroup} sx={{ mt: { xs: 0, md: 1 } }}>
              Add
            </Button>
          </Stack>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Current assignments
          </Typography>
          <Stack spacing={1}>
            {officeRoleGroups.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No rows yet — add at least one office / role group, or save to clear all roles.
              </Typography>
            ) : (
              officeRoleGroups.map((g, i) => (
                <Stack
                  key={`${g.officeId}-${i}`}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 1 }}
                >
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    <strong>{officeLabel(g.officeId, g.officeName)}</strong>
                    {": "}
                    {roleNamesForIds(g.roleIds || []) || "(no roles)"}
                  </Typography>
                  <IconButton size="small" aria-label="remove" onClick={() => handleRemoveGroup(i)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRoles} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

List.propTypes = {
  alertString: PropTypes.string,
  api_url: PropTypes.string,
  dropDownLists: PropTypes.object,
  handleEditClick: PropTypes.func,
  handleRefreshTable: PropTypes.func,
  handleSortClick: PropTypes.func,
  officeChangeID: PropTypes.string,
  rows: PropTypes.array,
  setOfficeChangeID: PropTypes.func,
  sortAttributeDirection: PropTypes.object,
  tableColumns: PropTypes.array,
  canEdit: PropTypes.bool,
  canAssignRoles: PropTypes.bool,
  canDelete: PropTypes.bool,
  loadRoleAssignments: PropTypes.func,
};

export default List;
