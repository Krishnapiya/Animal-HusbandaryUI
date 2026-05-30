import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PropTypes from "prop-types";
import { toast } from "material-react-toastify";
import {
  createMenu,
  createModule,
  getRolePermissions,
  listActions,
  listMenus,
  listModules,
  listRoles,
  saveRolePermissions,
  updateMenu,
  updateModule,
} from "../../api-client/rbac";

const STANDARD_ACTIONS = ["list", "save", "edit", "delete", "export"];

const FALLBACK_ACTIONS = STANDARD_ACTIONS;

const ACTION_HEADER_FALLBACK = {
  list: "View / list",
  save: "Create / save",
  edit: "Edit",
  delete: "Delete",
  export: "Export",
};

const extractPayloadList = (res) => {
  const d = res?.data;
  const p = d?.payLoad ?? d?.payload;
  if (Array.isArray(p)) return p;
  if (Array.isArray(d)) return d;
  return [];
};

const extractPermissionsMap = (res) => {
  const d = res?.data;
  return d?.payLoad?.permissions ?? d?.payload?.permissions ?? d?.permissions ?? {};
};

function actionColumnTitle(actionKey, actions, menu) {
  const k = String(actionKey).toLowerCase();
  const custom = (menu?.pageActions || []).find((a) => String(a.actionKey).toLowerCase() === k);
  if (custom?.label) {
    return custom.label;
  }
  const meta = actions.find((a) => String(a.actionKey).toLowerCase() === k);
  if (meta?.description) {
    return meta.description;
  }
  return ACTION_HEADER_FALLBACK[k] || actionKey;
}

function actionsForMenu(menu, globalActionKeys) {
  const standard = globalActionKeys.filter((k) => STANDARD_ACTIONS.includes(k));
  const custom = (menu?.pageActions || [])
    .map((a) => String(a.actionKey || "").toLowerCase())
    .filter(Boolean);
  return [...new Set([...standard, ...custom])];
}

const emptyPageAction = () => ({ actionKey: "", label: "", endpoint: "" });

function StructurePanel({
  modules,
  menus,
  moduleForm,
  setModuleForm,
  menuForm,
  setMenuForm,
  onCreateModule,
  onCreateMenu,
  editingModuleId,
  setEditingModuleId,
  editingMenuId,
  setEditingMenuId,
}) {
  const [structureTab, setStructureTab] = useState(0);
  const [menuListModuleFilter, setMenuListModuleFilter] = useState("");

  const moduleById = useMemo(() => {
    const map = {};
    modules.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [modules]);

  const filteredMenusForList = useMemo(() => {
    if (!menuListModuleFilter) {
      return menus;
    }
    return menus.filter((menu) => String(menu.moduleId) === String(menuListModuleFilter));
  }, [menus, menuListModuleFilter]);

  const startEditModule = (m) => {
    setEditingModuleId(m.id);
    setModuleForm({
      name: m.name || "",
      slug: m.slug || "",
      displayOrder: m.displayOrder ?? "",
    });
  };

  const cancelEditModule = () => {
    setEditingModuleId(null);
    setModuleForm({ name: "", slug: "", displayOrder: "" });
  };

  const startEditMenu = (menu) => {
    setEditingMenuId(menu.id);
    setMenuForm({
      moduleId: menu.moduleId ?? "",
      name: menu.name || "",
      slug: menu.slug || "",
      path: (menu.path || "").replace(/^\/+/, ""),
      parentId: menu.parentId ?? "",
      displayOrder: menu.displayOrder ?? "",
      pageActions: (menu.pageActions || []).map((a) => ({
        actionKey: a.actionKey || "",
        label: a.label || "",
        endpoint: a.endpoint || "",
      })),
    });
  };

  const cancelEditMenu = () => {
    setEditingMenuId(null);
    setMenuForm({
      moduleId: "",
      name: "",
      slug: "",
      path: "",
      parentId: "",
      displayOrder: "",
      pageActions: [],
    });
  };

  const addPageActionRow = () => {
    setMenuForm((p) => ({
      ...p,
      pageActions: [...(p.pageActions || []), emptyPageAction()],
    }));
  };

  const updatePageActionRow = (index, field, value) => {
    setMenuForm((p) => {
      const rows = [...(p.pageActions || [])];
      rows[index] = { ...rows[index], [field]: value };
      return { ...p, pageActions: rows };
    });
  };

  const removePageActionRow = (index) => {
    setMenuForm((p) => ({
      ...p,
      pageActions: (p.pageActions || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <Tabs
          value={structureTab}
          onChange={(_, v) => setStructureTab(v)}
          variant="fullWidth"
          sx={{ px: 1, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Modules" />
          <Tab label="Menus" />
        </Tabs>
      </Paper>

      {structureTab === 0 ? (
      <Card variant="outlined" sx={{ mt: "-1px", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Modules</Typography>
            <Typography variant="body2" color="text.secondary">
              Create application areas that group menus (e.g. Dashboard, Tasks).
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Module name"
                value={moduleForm.name}
                onChange={(e) => setModuleForm((p) => ({ ...p, name: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Module slug"
                value={moduleForm.slug}
                onChange={(e) => setModuleForm((p) => ({ ...p, slug: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Display order"
                type="number"
                value={moduleForm.displayOrder ?? ""}
                onChange={(e) => setModuleForm((p) => ({ ...p, displayOrder: e.target.value }))}
              />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignSelf: "flex-start" }}>
              <Button variant="contained" onClick={onCreateModule}>
                {editingModuleId ? "Update module" : "Add module"}
              </Button>
              {editingModuleId ? (
                <Button variant="outlined" color="warning" onClick={cancelEditModule}>
                  Cancel
                </Button>
              ) : null}
            </Stack>
            <Divider />
            <Typography variant="subtitle2" color="text.secondary">
              Existing modules
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Slug</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell align="left">{m.name}</TableCell>
                    <TableCell align="left">{m.slug}</TableCell>
                    <TableCell>{m.displayOrder ?? ""}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => startEditModule(m)} aria-label="edit module">
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </CardContent>
      </Card>
      ) : null}

      {structureTab === 1 ? (
      <Card variant="outlined" sx={{ mt: "-1px", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Menus</Typography>
            <Typography variant="body2" color="text.secondary">
              Register routes for RBAC. Add page-specific buttons (action slug + endpoint) to control them in the
              permission matrix.
            </Typography>
            <Select
              fullWidth
              value={menuForm.moduleId}
              displayEmpty
              onChange={(e) => setMenuForm((p) => ({ ...p, moduleId: e.target.value }))}
            >
              <MenuItem value="">Select module</MenuItem>
              {modules.map((module) => (
                <MenuItem key={module.id} value={module.id}>
                  {module.name}
                </MenuItem>
              ))}
            </Select>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Menu name"
                value={menuForm.name}
                onChange={(e) => setMenuForm((p) => ({ ...p, name: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Menu slug"
                value={menuForm.slug}
                onChange={(e) => setMenuForm((p) => ({ ...p, slug: e.target.value }))}
              />
            </Stack>
            <TextField
              fullWidth
              label="Route path"
              value={menuForm.path}
              onChange={(e) => setMenuForm((p) => ({ ...p, path: e.target.value }))}
              helperText="React route segment (e.g. my-entity)"
            />
            <TextField
              fullWidth
              label="Display order"
              type="number"
              value={menuForm.displayOrder ?? ""}
              onChange={(e) => setMenuForm((p) => ({ ...p, displayOrder: e.target.value }))}
            />
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2">Page-specific actions / buttons</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addPageActionRow}>
                Add action
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Each row is a button only on this page. Action slug is used in RBAC (@RequirePermission). Endpoint is the
              API path for that button.
            </Typography>
            {(menuForm.pageActions || []).length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No custom actions — only standard list/save/edit/delete/export apply.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {(menuForm.pageActions || []).map((row, index) => (
                  <Stack key={index} direction={{ xs: "column", md: "row" }} spacing={1} alignItems="flex-start">
                    <TextField
                      size="small"
                      label="Action slug"
                      value={row.actionKey}
                      onChange={(e) => updatePageActionRow(index, "actionKey", e.target.value)}
                      placeholder="assign-roles"
                      sx={{ flex: 1, minWidth: 140 }}
                    />
                    <TextField
                      size="small"
                      label="Button label"
                      value={row.label}
                      onChange={(e) => updatePageActionRow(index, "label", e.target.value)}
                      placeholder="Assign Roles"
                      sx={{ flex: 1, minWidth: 140 }}
                    />
                    <TextField
                      size="small"
                      label="Endpoint"
                      value={row.endpoint}
                      onChange={(e) => updatePageActionRow(index, "endpoint", e.target.value)}
                      placeholder="admin/auth/master/users/{id}/assign-roles"
                      sx={{ flex: 2, minWidth: 200 }}
                    />
                    <IconButton size="small" aria-label="remove action" onClick={() => removePageActionRow(index)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            )}
            <Select
              fullWidth
              value={menuForm.parentId}
              displayEmpty
              onChange={(e) => setMenuForm((p) => ({ ...p, parentId: e.target.value }))}
            >
              <MenuItem value="">No parent menu</MenuItem>
              {menus.map((menu) => (
                <MenuItem key={menu.id} value={menu.id}>
                  {menu.name}
                </MenuItem>
              ))}
            </Select>
            <Stack direction="row" spacing={1} sx={{ alignSelf: "flex-start" }}>
              <Button variant="contained" onClick={onCreateMenu}>
                {editingMenuId ? "Update menu" : "Add menu"}
              </Button>
              {editingMenuId ? (
                <Button variant="outlined" color="warning" onClick={cancelEditMenu} startIcon={<CloseIcon />}>
                  Cancel
                </Button>
              ) : null}
            </Stack>
            <Divider />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
            >
              <Typography variant="subtitle2" color="text.secondary">
                Existing menus
                {menuListModuleFilter
                  ? ` (${filteredMenusForList.length} in ${moduleById[menuListModuleFilter]?.name || "module"})`
                  : ` (${menus.length})`}
              </Typography>
              <Select
                size="small"
                displayEmpty
                value={menuListModuleFilter}
                onChange={(e) => setMenuListModuleFilter(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">All modules</MenuItem>
                {modules.map((module) => (
                  <MenuItem key={module.id} value={module.id}>
                    {module.name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Module</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Slug</TableCell>
                  <TableCell align="left">Path</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMenusForList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No menus found for this filter.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMenusForList.map((menu) => (
                  <TableRow key={menu.id} hover>
                    <TableCell align="left">{moduleById[menu.moduleId]?.name || menu.moduleId}</TableCell>
                    <TableCell align="left">{menu.name}</TableCell>
                    <TableCell align="left">{menu.slug}</TableCell>
                    <TableCell align="left">{menu.path}</TableCell>
                    <TableCell>{menu.displayOrder ?? ""}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => startEditMenu(menu)} aria-label="edit menu">
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Stack>
        </CardContent>
      </Card>
      ) : null}
    </Stack>
  );
}

StructurePanel.propTypes = {
  modules: PropTypes.arrayOf(PropTypes.object).isRequired,
  menus: PropTypes.arrayOf(PropTypes.object).isRequired,
  moduleForm: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    displayOrder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  setModuleForm: PropTypes.func.isRequired,
  menuForm: PropTypes.shape({
    moduleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    slug: PropTypes.string,
    path: PropTypes.string,
    parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    displayOrder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pageActions: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setMenuForm: PropTypes.func.isRequired,
  onCreateModule: PropTypes.func.isRequired,
  onCreateMenu: PropTypes.func.isRequired,
  editingModuleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setEditingModuleId: PropTypes.func.isRequired,
  editingMenuId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setEditingMenuId: PropTypes.func.isRequired,
};

const RbacAdminPage = () => {
  const [pageTab, setPageTab] = useState(0);
  const [modules, setModules] = useState([]);
  const [menus, setMenus] = useState([]);
  const [roles, setRoles] = useState([]);
  const [actions, setActions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [matrix, setMatrix] = useState({});
  const [dirtyRoleIds, setDirtyRoleIds] = useState(() => new Set());
  const [matrixLoading, setMatrixLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editingMenuId, setEditingMenuId] = useState(null);

  const [moduleForm, setModuleForm] = useState({ name: "", slug: "", displayOrder: "" });
  const [menuForm, setMenuForm] = useState({
    moduleId: "",
    name: "",
    slug: "",
    path: "",
    parentId: "",
    displayOrder: "",
    pageActions: [],
  });

  const actionKeys = useMemo(() => {
    const keys = actions.map((a) => a.actionKey).filter(Boolean).map((k) => String(k).toLowerCase());
    const unique = [...new Set(keys.length ? keys : FALLBACK_ACTIONS)];
    return unique;
  }, [actions]);

  const modulesById = useMemo(() => {
    const m = {};
    modules.forEach((mod) => {
      m[mod.id] = mod;
    });
    return m;
  }, [modules]);

  const menusById = useMemo(() => {
    const map = {};
    menus.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [menus]);

  const moduleSections = useMemo(() => {
    const byMod = new Map();
    menus.forEach((menu) => {
      const mid = menu.moduleId;
      if (mid == null) return;
      if (!byMod.has(mid)) byMod.set(mid, []);
      byMod.get(mid).push(menu);
    });
    byMod.forEach((list) => {
      list.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    });
    const orderedModuleIds = modules.map((m) => m.id).filter((id) => byMod.has(id));
    const rest = [...byMod.keys()].filter((id) => !orderedModuleIds.includes(id));
    const ids = [...orderedModuleIds, ...rest];
    return ids.map((moduleId) => ({
      moduleId,
      module: modulesById[moduleId] || { id: moduleId, name: `Module ${moduleId}`, slug: "" },
      menus: byMod.get(moduleId) || [],
    }));
  }, [menus, modules, modulesById]);

  const visibleSections = useMemo(() => {
    if (!selectedModuleId) return moduleSections;
    return moduleSections.filter(({ moduleId }) => String(moduleId) === String(selectedModuleId));
  }, [moduleSections, selectedModuleId]);

  const visibleRoles = useMemo(() => {
    if (!selectedRoleId) return roles;
    return roles.filter((r) => String(r.id) === String(selectedRoleId));
  }, [roles, selectedRoleId]);

  const normalizedMenuSearch = menuSearch.trim().toLowerCase();

  const groupedVisibleSections = useMemo(() => {
    return visibleSections.map(({ moduleId, module, menus: modMenus }) => {
      const filteredMenus = normalizedMenuSearch
        ? modMenus.filter((menu) => {
            const label = `${menu.name || ""} ${menu.slug || ""}`.toLowerCase();
            return label.includes(normalizedMenuSearch);
          })
        : modMenus;

      const groups = new Map();
      filteredMenus.forEach((menu) => {
        const key = menu.parentId != null ? `parent-${menu.parentId}` : "root";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(menu);
      });

      const groupList = [...groups.entries()].map(([key, groupMenus]) => {
        const isRoot = key === "root";
        const parentId = isRoot ? null : Number(String(key).replace("parent-", ""));
        const parentMenu = parentId != null ? menusById[parentId] : null;
        return {
          key: `${moduleId}-${key}`,
          isRoot,
          title: isRoot ? "Menus" : parentMenu?.name || `Parent menu ${parentId}`,
          menus: groupMenus.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""))),
        };
      });

      return {
        moduleId,
        module,
        groups: groupList,
      };
    });
  }, [visibleSections, normalizedMenuSearch, menusById]);

  const loadMaster = async () => {
    const [mRes, menuRes, roleRes, actionRes] = await Promise.all([
      listModules(),
      listMenus(),
      listRoles(),
      listActions(),
    ]);
    if (mRes?.isSuccess) setModules(extractPayloadList(mRes));
    if (menuRes?.isSuccess) setMenus(extractPayloadList(menuRes));
    if (roleRes?.isSuccess) setRoles(extractPayloadList(roleRes));
    if (actionRes?.isSuccess) setActions(extractPayloadList(actionRes));
  };

  const loadMatrix = useCallback(async (roleList) => {
    if (!roleList?.length) {
      setMatrix({});
      return;
    }
    setMatrixLoading(true);
    try {
      const results = await Promise.all(roleList.map((r) => getRolePermissions(r.id)));
      const next = {};
      roleList.forEach((r, i) => {
        next[r.id] = extractPermissionsMap(results[i]) || {};
      });
      setMatrix(next);
      setDirtyRoleIds(new Set());
    } catch (e) {
      console.error(e);
      toast.error("Failed to load role permissions");
    } finally {
      setMatrixLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMaster();
  }, []);

  useEffect(() => {
    loadMatrix(roles);
  }, [roles, loadMatrix]);

  const handleCreateModule = async () => {
    if (!moduleForm.name || !moduleForm.slug) {
      toast.error("Module name and slug are required");
      return;
    }
    const payload = {
      name: moduleForm.name,
      slug: moduleForm.slug,
      displayOrder: moduleForm.displayOrder === "" ? null : Number(moduleForm.displayOrder),
    };
    const response = editingModuleId
      ? await updateModule(editingModuleId, payload)
      : await createModule(payload);
    if (response?.isSuccess) {
      toast.success(editingModuleId ? "Module updated" : "Module created");
      setEditingModuleId(null);
      setModuleForm({ name: "", slug: "", displayOrder: "" });
      loadMaster();
      return;
    }
    toast.error(editingModuleId ? "Failed to update module" : "Failed to create module");
  };

  const handleCreateMenu = async () => {
    if (!menuForm.moduleId || !menuForm.name || !menuForm.slug || !menuForm.path) {
      toast.error("Module, name, slug and path are required");
      return;
    }
    const pageActions = (menuForm.pageActions || [])
      .map((a) => ({
        actionKey: String(a.actionKey || "").trim(),
        label: String(a.label || "").trim(),
        endpoint: String(a.endpoint || "").trim(),
      }))
      .filter((a) => a.actionKey);
    const payload = {
      moduleId: menuForm.moduleId,
      parentId: menuForm.parentId || null,
      name: menuForm.name,
      slug: menuForm.slug,
      path: menuForm.path,
      displayOrder: menuForm.displayOrder === "" ? null : Number(menuForm.displayOrder),
      pageActions,
    };
    const response = editingMenuId
      ? await updateMenu(editingMenuId, payload)
      : await createMenu(payload);
    if (response?.isSuccess) {
      toast.success(editingMenuId ? "Menu updated" : "Menu created");
      setEditingMenuId(null);
      setMenuForm({
        moduleId: "",
        name: "",
        slug: "",
        path: "",
        parentId: "",
        displayOrder: "",
        pageActions: [],
      });
      loadMaster();
      return;
    }
    toast.error(editingMenuId ? "Failed to update menu" : "Failed to create menu");
  };

  const toggleCell = (roleId, menuSlug, action) => {
    const act = String(action).toLowerCase();
    const slug = String(menuSlug).toLowerCase();
    setMatrix((prev) => {
      const rolePerms = prev[roleId] || {};
      const menuPerms = { ...(rolePerms[slug] || {}) };
      menuPerms[act] = !menuPerms[act];
      return {
        ...prev,
        [roleId]: {
          ...rolePerms,
          [slug]: menuPerms,
        },
      };
    });
    setDirtyRoleIds((prev) => new Set(prev).add(roleId));
  };

  const applyModuleRightsToRole = (roleId, moduleId, allowAll) => {
    const section = moduleSections.find((m) => String(m.moduleId) === String(moduleId));
    if (!section || section.menus.length === 0) {
      toast.info("No menus available in selected module");
      return;
    }
    setMatrix((prev) => {
      const rolePerms = { ...(prev[roleId] || {}) };
      section.menus.forEach((menu) => {
        const slug = String(menu.slug || "").toLowerCase();
        if (!slug) return;
        const nextActions = { ...(rolePerms[slug] || {}) };
        const menuActions = actionsForMenu(menu, actionKeys);
        menuActions.forEach((action) => {
          nextActions[action] = Boolean(allowAll);
        });
        rolePerms[slug] = nextActions;
      });
      return {
        ...prev,
        [roleId]: rolePerms,
      };
    });
    setDirtyRoleIds((prev) => new Set(prev).add(Number(roleId)));
  };

  const applyDefaultModuleRightsToRole = (roleId, moduleId) => {
    const section = moduleSections.find((m) => String(m.moduleId) === String(moduleId));
    if (!section || section.menus.length === 0) {
      toast.info("No menus available in selected module");
      return;
    }
    const defaultActionSet = new Set(["list"]);
    if (actionKeys.includes("index")) {
      defaultActionSet.add("index");
    }
    setMatrix((prev) => {
      const rolePerms = { ...(prev[roleId] || {}) };
      section.menus.forEach((menu) => {
        const slug = String(menu.slug || "").toLowerCase();
        if (!slug) return;
        const nextActions = { ...(rolePerms[slug] || {}) };
        const menuActions = actionsForMenu(menu, actionKeys);
        menuActions.forEach((action) => {
          nextActions[action] = defaultActionSet.has(action);
        });
        rolePerms[slug] = nextActions;
      });
      return {
        ...prev,
        [roleId]: rolePerms,
      };
    });
    setDirtyRoleIds((prev) => new Set(prev).add(Number(roleId)));
  };

  const handleSaveAll = async () => {
    if (dirtyRoleIds.size === 0) {
      toast.info("No permission changes to save");
      return;
    }
    setSaving(true);
    try {
      for (const roleId of dirtyRoleIds) {
        const payload = matrix[roleId] || {};
        const response = await saveRolePermissions(roleId, { permissions: payload });
        if (!response?.isSuccess) {
          toast.error(`Failed to save permissions for role id ${roleId}`);
          setSaving(false);
          return;
        }
      }
      toast.success("Permissions saved");
      setDirtyRoleIds(new Set());
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = (role) => role.name || role.roleName || `Role ${role.id}`;

  const checkboxSx = {
    p: 0.5,
    color: "action.disabled",
    "&.Mui-checked": { color: "success.main" },
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: 1600, mx: "auto" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Team &amp; permissions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Control access by role for each menu under your modules. Changes apply after you save.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {dirtyRoleIds.size > 0 ? (
            <Typography variant="caption" color="warning.main">
              {dirtyRoleIds.size} role{dirtyRoleIds.size > 1 ? "s" : ""} modified
            </Typography>
          ) : null}
          <Button
            variant="contained"
            color="success"
            disabled={saving || dirtyRoleIds.size === 0}
            onClick={handleSaveAll}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ mb: 2 }} variant="outlined">
        <Tabs value={pageTab} onChange={(_, v) => setPageTab(v)}>
          <Tab label="Permission matrix" />
          <Tab label="Modules & menus" />
        </Tabs>
      </Paper>

      {pageTab === 0 && (
        <Stack spacing={3}>
          <Card variant="outlined">
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider", bgcolor: "action.hover" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Role-right filters
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
                <Select
                  size="small"
                  displayEmpty
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="">All roles</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {roleLabel(role)}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  size="small"
                  displayEmpty
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="">All modules</MenuItem>
                  {modules.map((module) => (
                    <MenuItem key={module.id} value={module.id}>
                      {module.name || module.slug}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  size="small"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search menu name/slug"
                  sx={{ minWidth: 240 }}
                />
                <Button
                  variant="contained"
                  size="small"
                  disabled={!selectedRoleId || !selectedModuleId}
                  onClick={() => applyModuleRightsToRole(selectedRoleId, selectedModuleId, true)}
                >
                  Assign all actions
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={!selectedRoleId || !selectedModuleId}
                  onClick={() => applyDefaultModuleRightsToRole(selectedRoleId, selectedModuleId)}
                >
                  Assign default actions
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="warning"
                  disabled={!selectedRoleId || !selectedModuleId}
                  onClick={() => applyModuleRightsToRole(selectedRoleId, selectedModuleId, false)}
                >
                  Clear module rights
                </Button>
              </Stack>
            </Box>
          </Card>

          {matrixLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : roles.length === 0 ? (
            <Typography color="text.secondary">No roles defined yet.</Typography>
          ) : groupedVisibleSections.length === 0 ? (
            <Typography color="text.secondary">
              No matching module/menus found for the selected filter.
            </Typography>
          ) : (
            groupedVisibleSections.map(({ moduleId, module, groups }) => {
              if (groups.length === 0) return null;
              return (
                <Card key={moduleId} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider", bgcolor: "action.hover" }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {module.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {module.slug}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    {groups.map((group) => {
                      return (
                        <Box key={group.key} sx={{ mb: 1.5 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ px: 1, py: 0.5 }}>
                            {group.title}
                          </Typography>
                          {group.menus.map((menu) => (
                            <Accordion key={`${group.key}-menu-${menu.id}`} defaultExpanded={false}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="body2" fontWeight={500}>
                                  {menu.name} ({menu.slug})
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails sx={{ p: 0 }}>
                                <TableContainer sx={{ maxHeight: 420 }}>
                                  <Table size="small" stickyHeader>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell
                                          sx={{
                                            minWidth: 160,
                                            left: 0,
                                            zIndex: 3,
                                            bgcolor: "background.paper",
                                            fontWeight: 700,
                                            textAlign: "left",
                                            boxShadow: (t) =>
                                              `4px 0 12px -4px ${t.palette.mode === "dark" ? "#000" : "rgba(0,0,0,0.12)"}`,
                                          }}
                                        >
                                          Role
                                        </TableCell>
                                        {actionsForMenu(menu, actionKeys).map((action) => (
                                          <TableCell
                                            key={`${menu.id}-${action}`}
                                            align="center"
                                            sx={{
                                              minWidth: 104,
                                              verticalAlign: "bottom",
                                              bgcolor: "background.paper",
                                              px: 0.75,
                                              py: 1,
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              fontWeight={600}
                                              display="block"
                                              noWrap
                                              title={actionColumnTitle(action, actions, menu)}
                                            >
                                              {actionColumnTitle(action, actions, menu)}
                                            </Typography>
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {visibleRoles.map((role) => (
                                        <TableRow key={`${menu.id}-${role.id}`} hover>
                                          <TableCell
                                            sx={{
                                              position: "sticky",
                                              left: 0,
                                              zIndex: 2,
                                              bgcolor: "background.paper",
                                              fontWeight: 500,
                                              textAlign: "left",
                                              whiteSpace: "nowrap",
                                              boxShadow: (t) =>
                                                `4px 0 12px -4px ${t.palette.mode === "dark" ? "#000" : "rgba(0,0,0,0.12)"}`,
                                            }}
                                          >
                                            {roleLabel(role)}
                                          </TableCell>
                                          {actionsForMenu(menu, actionKeys).map((action) => {
                                            const slug = String(menu.slug || "").toLowerCase();
                                            const act = String(action).toLowerCase();
                                            const checked = Boolean(matrix[role.id]?.[slug]?.[act]);
                                            return (
                                              <TableCell key={`${role.id}-${menu.id}-${action}`} align="center" sx={{ py: 0.5 }}>
                                                <Checkbox
                                                  size="small"
                                                  checked={checked}
                                                  onChange={() => toggleCell(role.id, slug, act)}
                                                  sx={checkboxSx}
                                                />
                                              </TableCell>
                                            );
                                          })}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      );
                    })}
                  </Box>
                </Card>
              );
            })
          )}
        </Stack>
      )}

      {pageTab === 1 && (
        <StructurePanel
          modules={modules}
          menus={menus}
          moduleForm={moduleForm}
          setModuleForm={setModuleForm}
          menuForm={menuForm}
          setMenuForm={setMenuForm}
          onCreateModule={handleCreateModule}
          onCreateMenu={handleCreateMenu}
          editingModuleId={editingModuleId}
          setEditingModuleId={setEditingModuleId}
          editingMenuId={editingMenuId}
          setEditingMenuId={setEditingMenuId}
        />
      )}
    </Box>
  );
};

export default RbacAdminPage;
