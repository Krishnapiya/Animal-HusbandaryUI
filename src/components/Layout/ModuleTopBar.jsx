import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useAuthz } from "../../context/AuthzContext";

const keyOf = (m) => String(m?.segment ?? m?.slug ?? m?.title ?? "");

/**
 * Module switcher in the app header (dropdown). Selecting a module filters the left sidebar
 * to that module's menus (from /api/me/navigation).
 */
const ModuleTopBar = () => {
  const { apiNavModules, activeModuleSegment, setActiveModuleSegment } = useAuthz();

  if (!apiNavModules.length) {
    return null;
  }

  const resolvedActive =
    activeModuleSegment != null && activeModuleSegment !== ""
      ? activeModuleSegment
      : keyOf(apiNavModules[0]);

  const labelId = "module-topbar-select-label";

  if (apiNavModules.length === 1) {
    const only = apiNavModules[0];
    return (
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", py: 0.5 }}>
        <Typography variant="body2" sx={{ color: "inherit", fontWeight: 600, opacity: 0.95 }}>
          {only.title || only.name || "Module"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        py: 0.5,
        pr: 1,
      }}
    >
      <FormControl
        variant="standard"
        size="small"
        sx={{
          minWidth: { xs: 140, sm: 200 },
          maxWidth: "min(320px, 45vw)",
          color: "inherit",
          "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
          "& .MuiInputLabel-root.Mui-focused": { color: "rgba(255,255,255,0.95)" },
          "& .MuiInputBase-root": { color: "inherit" },
          "& .MuiSelect-icon": { color: "rgba(255,255,255,0.85)" },
          "& .MuiInput-underline:before": { borderBottomColor: "rgba(255,255,255,0.35)" },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottomColor: "rgba(255,255,255,0.55)",
          },
          "& .MuiInput-underline:after": { borderBottomColor: "rgba(255,255,255,0.9)" },
        }}
      >
        <InputLabel id={labelId} shrink>
          Module
        </InputLabel>
        <Select
          labelId={labelId}
          label="Module"
          value={resolvedActive}
          displayEmpty
          onChange={(e) => setActiveModuleSegment(e.target.value)}
          MenuProps={{
            PaperProps: { sx: { maxHeight: 360 } },
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          }}
        >
          {apiNavModules.map((mod) => {
            const k = keyOf(mod);
            return (
              <MenuItem key={k || mod.title} value={k} dense>
                {mod.title || mod.name || "Module"}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ModuleTopBar;
