import PropTypes from "prop-types";
import { useMemo, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import EventIcon from "@mui/icons-material/Event";

import { toast } from "material-react-toastify";

import { getUserAttributes } from "../../utils";

import {
  getAdminDogBreederApplicationPreview,
  downloadDogBreederApplication,
  viewDogBreederDocument,
  downloadDogBreederDocument,
  forwardDogBreederApplication,
  saveDogBreederInspection,
  uploadDogBreederInspectionReport,
  getDogBreederInspection,
  approveDogBreederApplication,
  rejectDogBreederApplication,
} from "../../api-client/adminDogBreederApplication";

/* =========================================================
   APPLICATION ID
========================================================= */

const getApplicationId = (row) => {
  if (!row) {
    return null;
  }

  const id =
    row?.id ??
    row?.applicationId ??
    row?.registrationApplicationId ??
    row?.registration_application_id ??
    row?.registrationDetails?.id ??
    row?.registrationDetails?.applicationId ??
    row?.application?.id ??
    row?.application?.applicationId;

  return id !== null && id !== undefined
    ? String(id)
    : null;
};

/* =========================================================
   API PAYLOAD
========================================================= */

const getPayload = (response) => {
  return (
    response?.data?.payLoad ||
    response?.data?.payload ||
    response?.data?.data ||
    response?.payLoad ||
    response?.payload ||
    response?.data ||
    {}
  );
};

/* =========================================================
   VALUE FORMATTER
========================================================= */

const getValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return (
      value?.name ||
      value?.label ||
      value?.value ||
      value?.code ||
      JSON.stringify(value)
    );
  }

  return value;
};

/* =========================================================
   ARRAY
========================================================= */

const getArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/* =========================================================
   STATUS NORMALIZER
========================================================= */

const normalizeStatus = (value) => {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
};

/* =========================================================
   GET EXACT STATUS FROM ROW
========================================================= */

const getRowStatus = (row) => {
  if (!row) {
    return "";
  }

  const possibleStatuses = [
    row?.statusCode,
    row?.statusName,
    row?.status,

    row?.applicationStatusCode,
    row?.applicationStatusName,
    row?.applicationStatus,

    row?.registrationStatusCode,
    row?.registrationStatusName,
    row?.registrationStatus,

    row?.status?.statusCode,
    row?.status?.code,
    row?.status?.name,
    row?.status?.statusName,

    row?.applicationStatus?.statusCode,
    row?.applicationStatus?.code,
    row?.applicationStatus?.name,
    row?.applicationStatus?.statusName,

    row?.registrationDetails?.statusCode,
    row?.registrationDetails?.statusName,
    row?.registrationDetails?.status,

    row?.registrationDetails?.applicationStatusCode,
    row?.registrationDetails?.applicationStatusName,
    row?.registrationDetails?.applicationStatus,

    row?.registrationDetails?.status?.statusCode,
    row?.registrationDetails?.status?.code,
    row?.registrationDetails?.status?.name,
    row?.registrationDetails?.status?.statusName,
  ];

  for (const value of possibleStatuses) {
    if (
      value !== null &&
      value !== undefined &&
      typeof value !== "object"
    ) {
      const status = normalizeStatus(value);

      if (status) {
        return status;
      }
    }
  }

  return "";
};

/* =========================================================
   ROLE NORMALIZER
========================================================= */

const normalizeRole = (role) => {
  return String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");
};

/* =========================================================
   GET LOGGED-IN ROLES
========================================================= */

const getLoggedInRoles = () => {
  const user = getUserAttributes();

  if (!user) {
    return [];
  }

  const roleValues = [
    user?.role,
    user?.roleName,
    user?.authority,
    user?.authorities,

    user?.role?.name,
    user?.role?.roleName,
    user?.role?.authority,
    user?.role?.code,
  ];

  if (Array.isArray(user?.roles)) {
    roleValues.push(...user.roles);
  }

  if (Array.isArray(user?.authorities)) {
    roleValues.push(...user.authorities);
  }

  return roleValues
    .flatMap((role) => {
      if (typeof role === "string") {
        return [role];
      }

      if (Array.isArray(role)) {
        return role;
      }

      return [
        role?.name,
        role?.roleName,
        role?.authority,
        role?.code,
      ];
    })
    .filter(Boolean)
    .map(normalizeRole);
};

/* =========================================================
   STATUS TABS - ADMIN
========================================================= */

const ADMIN_STATUS_TABS = [
  {
    value: "ALL",
    label: "ALL",
  },
  {
    value: "SUBMITTED",
    label: "SUBMITTED",
  },
  {
    value: "FORWARDED_TO_CVO",
    label: "FORWARDED TO CVO",
  },
  {
    value: "INSPECTION_SCHEDULED",
    label: "INSPECTION SCHEDULED",
  },
  {
    value: "VERIFIED_BY_CVO",
    label: "VERIFIED BY CVO",
  },
  {
    value: "REJECTED_BY_CVO",
    label: "REJECTED BY CVO",
  },
  {
    value: "RESUBMITTED",
    label: "RESUBMITTED",
  },
  {
    value: "APPLICATION_APPROVED",
    label: "APPROVED",
  },
  {
    value: "APPLICATION_REJECTED",
    label: "REJECTED",
  },
];
/* =========================================================
   STATUS TABS - CVO
========================================================= */

const CVO_STATUS_TABS = [
  {
    value: "ALL",
    label: "ALL",
  },
  {
    value: "FORWARDED_TO_CVO",
    label: "FORWARDED TO CVO",
  },
  {
    value: "INSPECTION_SCHEDULED",
    label: "INSPECTION SCHEDULED",
  },
  {
    value: "VERIFIED_BY_CVO",
    label: "VERIFIED BY CVO",
  },
  {
    value: "REJECTED_BY_CVO",
    label: "REJECTED BY CVO",
  },
  {
    value: "RESUBMITTED",
    label: "RESUBMITTED",
  },
];

/* =========================================================
   STATUS TABS - DOG BREEDER
========================================================= */

const BREEDER_STATUS_TABS = [
  {
    value: "ALL",
    label: "ALL",
  },
  {
    value: "DRAFT",
    label: "DRAFT",
  },
  {
    value: "SUBMITTED",
    label: "SUBMITTED",
  },
  {
    value: "RESUBMITTED",
    label: "RESUBMITTED",
  },
  {
    value: "APPLICATION_APPROVED",
    label: "APPROVED",
  },
];

/* =========================================================
   PREVIEW ROW
========================================================= */

const PreviewRow = ({ label, value }) => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 0.5 }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontWeight: 600,
          mb: 1,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {getValue(value)}
      </Typography>
    </Grid>
  );
};

PreviewRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({ children }) => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          mb: 1,
        }}
      >
        {children}
      </Typography>

      <Divider sx={{ mb: 2 }} />
    </>
  );
};

SectionTitle.propTypes = {
  children: PropTypes.node,
};

/* =========================================================
   STATUS LABEL
========================================================= */

const getStatusLabel = (status) => {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "SUBMITTED":
      return "Submitted";

    case "FORWARDED_TO_CVO":
      return "Forwarded to CVO";

    case "INSPECTION_SCHEDULED":
      return "Inspection Scheduled";

    case "VERIFIED_BY_CVO":
      return "Verified by CVO";

    case "REJECTED_BY_CVO":
      return "Rejected by CVO";

    case "RESUBMITTED":
      return "Resubmitted";

    case "APPLICATION_APPROVED":
      return "Application Approved";

    case "APPLICATION_REJECTED":
      return "Application Rejected";

    default:
      return status || "-";
  }
};

/* =========================================================
   LOCAL DATE
========================================================= */

const getTodayLocalDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const List = (props) => {
  /* =======================================================
     PREVIEW
  ======================================================= */

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  /* =======================================================
     FORWARD
  ======================================================= */

  const [forwardingId, setForwardingId] = useState(null);

  /* =======================================================
     INSPECTION
  ======================================================= */

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const [
    selectedRowForInspection,
    setSelectedRowForInspection,
  ] = useState(null);

  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionRemarks, setInspectionRemarks] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  /* =======================================================
     REPORT
  ======================================================= */

  const [uploadReportOpen, setUploadReportOpen] = useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [inspectionReport, setInspectionReport] = useState(null);
  const [existingReport, setExistingReport] = useState(null);

  const [remarks, setRemarks] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =======================================================
     LOCAL FALLBACK STATUS
  ======================================================= */

  const [scheduledInspectionIds, setScheduledInspectionIds] =
    useState(new Set());

  const [locallyForwardedIds, setLocallyForwardedIds] =
    useState(new Set());

  /* =======================================================
     ROLE
  ======================================================= */

  const loggedInRoles = getLoggedInRoles();

  const isAdmin = loggedInRoles.includes("ADMIN");

  const isCvo = loggedInRoles.includes("CVO");

  const isDogBreeder =
    loggedInRoles.includes("DOG_BREEDER") ||
    loggedInRoles.includes("BREEDER");

  /* =======================================================
     ACTION VISIBILITY
  ======================================================= */

  const showForwardAction =
    props.showForwardAction !== undefined
      ? props.showForwardAction
      : isAdmin;

  const showScheduleInspectionAction =
    props.showScheduleInspectionAction !== undefined
      ? props.showScheduleInspectionAction
      : isCvo;

  const showDecisionColumn =
    props.showDecisionColumn !== undefined
      ? props.showDecisionColumn
      : isCvo;

  const showActionColumn =
    showForwardAction || showScheduleInspectionAction;

  /* =======================================================
     STATUS TABS BASED ON ROLE
  ======================================================= */

  const statusTabs = useMemo(() => {
    if (isAdmin) {
      return ADMIN_STATUS_TABS;
    }

    if (isCvo) {
      return CVO_STATUS_TABS;
    }

    if (isDogBreeder) {
      return BREEDER_STATUS_TABS;
    }

    return ADMIN_STATUS_TABS;
  }, [isAdmin, isCvo, isDogBreeder]);

  /* =======================================================
     SELECTED TAB
  ======================================================= */

  const [selectedStatusTab, setSelectedStatusTab] =
    useState("ALL");

  const validSelectedTab = statusTabs.some(
    (tab) => tab.value === selectedStatusTab
  )
    ? selectedStatusTab
    : "ALL";

  /* =======================================================
     ALL ROWS
  ======================================================= */

  const allRows = Array.isArray(props.rows)
    ? props.rows
    : [];

  /* =======================================================
     EFFECTIVE STATUS
  ======================================================= */

  const getEffectiveStatus = (row) => {
    const applicationId = getApplicationId(row);
    const serverStatus = getRowStatus(row);

    /*
     * Backend status always wins.
     */
    if (serverStatus) {
      return serverStatus;
    }

    /*
     * Local status is only a temporary fallback.
     */
    if (
      applicationId &&
      scheduledInspectionIds.has(applicationId)
    ) {
      return "INSPECTION_SCHEDULED";
    }

    if (
      applicationId &&
      locallyForwardedIds.has(applicationId)
    ) {
      return "FORWARDED_TO_CVO";
    }

    return "";
  };

  /* =======================================================
     FILTERED ROWS
  ======================================================= */

/* =======================================================
   FILTERED ROWS
======================================================= */

const filteredRows = useMemo(() => {
  /*
   * Admin and CVO must NEVER see DRAFT applications.
   * Dog Breeder can see DRAFT applications.
   */
  const visibleRows = allRows.filter((row) => {
    const status = getEffectiveStatus(row);

    if ((isAdmin || isCvo) && status === "DRAFT") {
      return false;
    }

    return true;
  });

  if (validSelectedTab === "ALL") {
    return visibleRows;
  }

  return visibleRows.filter(
    (row) =>
      getEffectiveStatus(row) === validSelectedTab
  );
}, [
  allRows,
  validSelectedTab,
  scheduledInspectionIds,
  locallyForwardedIds,
  isAdmin,
  isCvo,
]);
  /* =======================================================
     STATUS COUNTS
  ======================================================= */

  const statusCounts = useMemo(() => {
    const counts = {};

    statusTabs.forEach((tab) => {
      counts[tab.value] = 0;
    });

    counts.ALL = allRows.length;

    allRows.forEach((row) => {
      const status = getEffectiveStatus(row);

      if (
        Object.prototype.hasOwnProperty.call(
          counts,
          status
        )
      ) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [
    allRows,
    statusTabs,
    scheduledInspectionIds,
    locallyForwardedIds,
  ]);

  /* =======================================================
     STATUS TAB CHANGE
  ======================================================= */

  const handleStatusTabChange = (event, newValue) => {
    setSelectedStatusTab(newValue);
  };

  /* =======================================================
     FORWARD CHECK
  ======================================================= */

  const isForwardedToCvo = (row) => {
    return (
      getEffectiveStatus(row) ===
      "FORWARDED_TO_CVO"
    );
  };

  /* =======================================================
     REFRESH LIST
     
     ONLY REFRESH LOGIC UPDATED
======================================================= */

  const refreshList = async () => {
    try {
      /*
       * Parent refresh function.
       * This is the preferred method because the parent
       * will fetch fresh backend data and update props.rows.
       */
      if (typeof props.refreshList === "function") {
        await props.refreshList();

        /*
         * Remove temporary local status after fresh
         * backend data has been loaded.
         */
        setScheduledInspectionIds(new Set());
        setLocallyForwardedIds(new Set());

        return true;
      }

      /*
       * Backward-compatible refresh function.
       */
      if (typeof props.handleRefresh === "function") {
        await props.handleRefresh();

        setScheduledInspectionIds(new Set());
        setLocallyForwardedIds(new Set());

        return true;
      }

      /*
       * If the parent does not provide either callback,
       * reload the page so the backend data is fetched again.
       */
      window.location.reload();

      return true;
    } catch (error) {
      console.error(
        "Refresh list error:",
        error
      );

      /*
       * If parent refresh fails, force a complete reload.
       */
      window.location.reload();

      return false;
    }
  };

  /* =======================================================
     PREVIEW
  ======================================================= */

  const handlePreviewClick = async (row) => {
    const applicationId = getApplicationId(row);

    if (!applicationId) {
      toast.error("Application ID missing");
      return;
    }

    setPreviewOpen(true);
    setPreviewData(row);

    try {
      setPreviewLoading(true);

      const response =
        await getAdminDogBreederApplicationPreview(
          applicationId
        );

      const payload = getPayload(response);

      const breeder =
        payload?.breederDetail ||
        payload?.breederDetails ||
        payload?.breeder ||
        {};

      const reg =
        payload?.registrationDetails ||
        payload?.registration ||
        {};

      const parseEntityValue = (val) => {
        if (!val) {
          return "";
        }

        if (typeof val === "object") {
          return (
            val?.name ||
            val?.label ||
            val?.localBodyTypeName ||
            val?.localBodyName ||
            val?.districtName ||
            val?.value ||
            ""
          );
        }

        return val;
      };

      const fullAddress = [
        breeder?.addressLine1 ||
          payload?.addressLine1 ||
          row?.addressLine1,

        breeder?.addressLine2 ||
          payload?.addressLine2 ||
          row?.addressLine2,

        parseEntityValue(
          breeder?.city ||
            payload?.city ||
            row?.city
        ),

        breeder?.pincode ||
          payload?.pincode ||
          row?.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      setPreviewData({
        ...row,
        ...payload,

        applicationNumber:
          payload?.applicationNumber ||
          reg?.applicationNumber ||
          row?.applicationNumber,

        district:
          parseEntityValue(reg?.district) ||
          parseEntityValue(payload?.district) ||
          getValue(row?.district),

        localBodyType:
          parseEntityValue(
            reg?.localBodyType
          ) ||
          parseEntityValue(
            payload?.localBodyType
          ) ||
          parseEntityValue(
            row?.localBodyType
          ),

        localBody:
          parseEntityValue(
            reg?.localBody
          ) ||
          parseEntityValue(
            payload?.localBody
          ) ||
          parseEntityValue(
            row?.localBody
          ),

        establishmentName:
          reg?.establishmentName ||
          breeder?.establishmentName ||
          payload?.establishmentName ||
          row?.establishmentName,

        applicationStatus:
          parseEntityValue(reg?.status) ||
          parseEntityValue(payload?.status) ||
          getRowStatus(row),

        breederName:
          breeder?.breederName ||
          breeder?.name ||
          payload?.breederName ||
          row?.breederName,

        mobileNumber:
          breeder?.contactMobile ||
          breeder?.mobileNumber ||
          payload?.mobileNumber ||
          payload?.contactMobile ||
          row?.mobileNumber,

        email:
          breeder?.contactEmail ||
          breeder?.email ||
          payload?.email ||
          payload?.contactEmail ||
          row?.email,

        address:
          fullAddress ||
          getValue(row?.address),

        facilityAddress:
          breeder?.facilityAddress ||
          payload?.facilityAddress ||
          row?.facilityAddress,

        totalArea:
          payload?.totalArea ||
          breeder?.totalArea ||
          row?.totalArea,

        numberOfCages:
          payload?.numberOfCages ||
          breeder?.numberOfCages ||
          row?.numberOfCages,

        veterinaryCareDetails:
          payload?.veterinaryCareDetails ||
          breeder?.veterinaryCareDetails ||
          row?.veterinaryCareDetails,
      });
    } catch (error) {
      console.error(
        "Dog breeder preview error:",
        error
      );

      toast.error(
        "Preview API failed. Showing available list data."
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  /* =======================================================
     CLOSE PREVIEW
  ======================================================= */

  const handleClosePreview = () => {
    if (previewLoading) {
      return;
    }

    setPreviewOpen(false);
    setPreviewData(null);
  };

  /* =======================================================
     DOWNLOAD APPLICATION
  ======================================================= */

  const handleDownloadClick = async (row) => {
    const applicationId = getApplicationId(row);

    if (!applicationId) {
      toast.error("Application ID missing");
      return;
    }

    try {
      const response =
        await downloadDogBreederApplication(
          applicationId
        );

      const blob = new Blob([response.data], {
        type:
          response?.headers?.["content-type"] ||
          "application/pdf",
      });

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        row?.applicationNumber ||
        `dog-breeder-application-${applicationId}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      console.error(
        "Dog breeder application download error:",
        error
      );

      toast.error(
        "Failed to download application"
      );
    }
  };

  /* =======================================================
     OPEN BLOB
  ======================================================= */

  const openBlob = (
    response,
    fileName,
    isDownload = false,
    mimeType = "application/octet-stream"
  ) => {
    if (!response?.data) {
      toast.error("File data is empty");
      return;
    }

    const blob = new Blob([response.data], {
      type:
        response?.headers?.["content-type"] ||
        mimeType ||
        "application/octet-stream",
    });

    const url =
      URL.createObjectURL(blob);

    if (isDownload) {
      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        fileName || "document";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } else {
      window.open(
        url,
        "_blank"
      );
    }

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  };

  /* =======================================================
     VIEW DOCUMENT
  ======================================================= */

  const handleViewDocument = async (
    documentData
  ) => {
    if (!documentData?.id) {
      toast.error(
        "Document ID missing"
      );
      return;
    }

    try {
      const response =
        await viewDogBreederDocument(
          documentData.id
        );

      openBlob(
        response,
        documentData.fileName ||
          documentData.name ||
          "document",
        false,
        documentData.mimeType ||
          "application/pdf"
      );
    } catch (error) {
      console.error(
        "Document view error:",
        error
      );

      toast.error(
        "Failed to view document"
      );
    }
  };

  /* =======================================================
     DOWNLOAD DOCUMENT
  ======================================================= */

  const handleDownloadDocument = async (
    documentData
  ) => {
    if (!documentData?.id) {
      toast.error(
        "Document ID missing"
      );
      return;
    }

    try {
      const response =
        await downloadDogBreederDocument(
          documentData.id
        );

      openBlob(
        response,
        documentData.fileName ||
          documentData.name ||
          "document",
        true,
        documentData.mimeType ||
          "application/octet-stream"
      );
    } catch (error) {
      console.error(
        "Document download error:",
        error
      );

      toast.error(
        "Failed to download document"
      );
    }
  };

  /* =======================================================
     FORWARD TO CVO
  ======================================================= */

  const handleForwardClick = async (
    row
  ) => {
    const applicationId =
      getApplicationId(row);

    if (!applicationId) {
      toast.error(
        "Application ID missing"
      );
      return;
    }

    if (isForwardedToCvo(row)) {
      toast.info(
        "Application is already forwarded to CVO"
      );
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to forward this application to CVO?"
      )
    ) {
      return;
    }

    try {
      setForwardingId(
        applicationId
      );

      await forwardDogBreederApplication(
        applicationId
      );

      setLocallyForwardedIds(
        (previousIds) => {
          const next =
            new Set(previousIds);

          next.add(applicationId);

          return next;
        }
      );

      toast.success(
        "Application forwarded to CVO successfully"
      );

      await refreshList();
    } catch (error) {
      console.error(
        "Dog breeder forward to CVO error:",
        error
      );

      const message =
        error?.response?.data
          ?.resultString ||
        error?.response?.data
          ?.message ||
        error?.response?.data
          ?.error ||
        error?.message ||
        "Failed to forward application to CVO";

      toast.error(message);
    } finally {
      setForwardingId(null);
    }
  };

  /* =======================================================
     OPEN SCHEDULE MODAL
  ======================================================= */

  const handleOpenScheduleModal = (
    row
  ) => {
    const applicationId =
      getApplicationId(row);

    if (!applicationId) {
      toast.error(
        "Application ID missing"
      );
      return;
    }

    setSelectedRowForInspection(row);
    setInspectionDate("");
    setInspectionRemarks("");
    setScheduleModalOpen(true);
  };

  /* =======================================================
     CLOSE SCHEDULE MODAL
  ======================================================= */

  const handleCloseScheduleModal = () => {
    if (isScheduling) {
      return;
    }

    setScheduleModalOpen(false);
    setSelectedRowForInspection(null);
    setInspectionDate("");
    setInspectionRemarks("");
  };

  /* =======================================================
     SAVE INSPECTION
  ======================================================= */

  const handleSaveInspection = async () => {
    if (!inspectionDate) {
      toast.error(
        "Please select inspection date"
      );
      return;
    }

    const applicationId =
      getApplicationId(
        selectedRowForInspection
      );

    if (!applicationId) {
      toast.error(
        "Application ID missing"
      );
      return;
    }

    try {
      setIsScheduling(true);

      await saveDogBreederInspection({
        applicationId,
        inspectionDate,
        inspectionRemarks:
          inspectionRemarks?.trim() ||
          "",
      });

      toast.success(
        "Inspection Scheduled Successfully"
      );

      setScheduledInspectionIds(
        (previousIds) => {
          const next =
            new Set(previousIds);

          next.add(applicationId);

          return next;
        }
      );

      setScheduleModalOpen(false);
      setSelectedRowForInspection(null);
      setInspectionDate("");
      setInspectionRemarks("");

      await refreshList();
    } catch (error) {
      console.error(
        "Save inspection error:",
        error
      );

      const message =
        error?.response?.data
          ?.resultString ||
        error?.response?.data
          ?.message ||
        error?.response?.data
          ?.error ||
        error?.message ||
        "Unable to schedule inspection";

      toast.error(message);
    } finally {
      setIsScheduling(false);
    }
  };

  /* =======================================================
     OPEN UPLOAD REPORT
  ======================================================= */

 /* =======================================================
   OPEN UPLOAD REPORT
======================================================= */

const handleUploadReportClick = async (row) => {
  const applicationId = getApplicationId(row);

  if (!applicationId) {
    toast.error("Application ID missing");
    return;
  }

  const currentStatus = getEffectiveStatus(row);

  if (
    currentStatus === "VERIFIED_BY_CVO" ||
    currentStatus === "REJECTED_BY_CVO"
  ) {
    toast.info(
      "Inspection decision is already completed"
    );
    return;
  }

  if (currentStatus !== "INSPECTION_SCHEDULED") {
    toast.info(
      "Please schedule the inspection before uploading the report"
    );
    return;
  }

  /*
   * Reset UPLOAD REPORT fields.
   *
   * These are completely independent from
   * Schedule Inspection fields.
   */
  setSelectedApplication(row);
  setInspectionReport(null);
  setExistingReport(null);

  // IMPORTANT:
  // Do NOT copy inspectionRemarks here.
  setRemarks("");
  setRecommendation("");

  try {
    const response =
      await getDogBreederInspection(applicationId);

    const data = getPayload(response);

    if (data) {
      /*
       * Existing uploaded inspection report
       */
      setExistingReport(
        data?.inspectionReport ||
          data?.reportFile ||
          data?.file ||
          data?.inspectionReportFile ||
          null
      );

      /*
       * IMPORTANT:
       *
       * Upload Report Remarks must use ONLY
       * reportRemarks.
       *
       * DO NOT use:
       * data.inspectionRemarks
       * data.remarks
       *
       * because those may contain the Schedule
       * Inspection remarks.
       */
      setRemarks(
        data?.reportRemarks != null
          ? data.reportRemarks
          : ""
      );

      /*
       * Recommendation Details is also a
       * separate field.
       */
      setRecommendation(
        data?.recommendation != null
          ? data.recommendation
          : ""
      );
    }
  } catch (error) {
    console.error(
      "Get inspection error:",
      error
    );

    /*
     * Keep Upload Report remarks empty
     * if the inspection API fails.
     */
    setRemarks("");
    setRecommendation("");
    setExistingReport(null);
  }

  setUploadReportOpen(true);
};
  /* =======================================================
     CLOSE UPLOAD REPORT
  ======================================================= */

  const handleCloseUploadReport = () => {
    if (isSubmitting) {
      return;
    }

    setUploadReportOpen(false);
    setSelectedApplication(null);
    setInspectionReport(null);
    setExistingReport(null);
    setRemarks("");
    setRecommendation("");
  };

  /* =======================================================
     SUBMIT DECISION
  ======================================================= */

  const handleSubmitDecision = async (
    decisionStatus,
    targetRow = null
  ) => {
    const appRow =
      targetRow ||
      selectedApplication;

    const applicationId =
      getApplicationId(appRow);

    if (!applicationId) {
      toast.error(
        "Application ID missing"
      );
      return;
    }

    /* =====================================================
       ADMIN FINAL DECISION
    ===================================================== */

    if (targetRow) {
      const currentStatus =
        getEffectiveStatus(
          targetRow
        );

      if (
        currentStatus !==
        "VERIFIED_BY_CVO"
      ) {
        toast.error(
          "Application must be verified by CVO before final decision"
        );
        return;
      }

      if (
        ![
          "APPROVED",
          "REJECTED",
        ].includes(decisionStatus)
      ) {
        toast.error(
          "Invalid decision"
        );
        return;
      }

      try {
        setIsSubmitting(true);

        if (
          decisionStatus ===
          "APPROVED"
        ) {
          await approveDogBreederApplication(
            applicationId
          );
        } else {
          await rejectDogBreederApplication(
            applicationId
          );
        }

        toast.success(
          `Application ${decisionStatus.toLowerCase()} successfully`
        );

        await refreshList();
      } catch (error) {
        console.error(
          "Admin final decision error:",
          error
        );

        const message =
          error?.response?.data
            ?.resultString ||
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          error?.message ||
          "Failed to process application decision";

        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    /* =====================================================
       CVO INSPECTION DECISION
    ===================================================== */

    if (
      !inspectionReport &&
      !existingReport
    ) {
      toast.error(
        "Please select an inspection report file"
      );
      return;
    }

    if (
      !decisionStatus ||
      ![
        "APPROVED",
        "REJECTED",
      ].includes(
        decisionStatus
      )
    ) {
      toast.error(
        "Invalid decision"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "applicationId",
        applicationId
      );

      if (inspectionReport) {
        formData.append(
          "reportFile",
          inspectionReport
        );
      }

      const trimmedRemarks =
        remarks?.trim() || "";

      const trimmedRecommendation =
        recommendation?.trim() || "";

      let combinedRemarks =
        trimmedRemarks;

      if (
        trimmedRecommendation
      ) {
        combinedRemarks =
          combinedRemarks
            ? `${combinedRemarks} | Recommendation: ${trimmedRecommendation}`
            : `Recommendation: ${trimmedRecommendation}`;
      }

      formData.append(
        "remarks",
        combinedRemarks
      );

      const strictRecommendation =
        decisionStatus ===
        "APPROVED"
          ? "APPROVED"
          : "REJECTED";

      formData.append(
        "recommendation",
        strictRecommendation
      );

      await uploadDogBreederInspectionReport(
        formData
      );

      toast.success(
        `Inspection report uploaded & ${
          decisionStatus ===
          "APPROVED"
            ? "approved"
            : "rejected"
        } successfully`
      );

      handleCloseUploadReport();

      await refreshList();
    } catch (error) {
      console.error(
        "Error submitting CVO inspection decision:",
        error
      );

      const message =
        error?.response?.data
          ?.resultString ||
        error?.response?.data
          ?.message ||
        error?.response?.data
          ?.error ||
        error?.message ||
        "Failed to process request";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     PREVIEW DATA
  ======================================================= */

  const registration =
    previewData?.registrationDetails ||
    previewData ||
    {};

  const breeder =
    previewData?.breederDetails ||
    previewData?.breeder ||
    {};

  const facility =
    previewData?.facilityDetails ||
    previewData?.facility ||
    {};

  const breeds = getArray(
    previewData?.breedDetails ||
      previewData?.breeds ||
      previewData?.breedDetailsList
  );

  const documents = getArray(
    previewData?.documentDetails ||
      previewData?.documents ||
      previewData?.applicationDocuments ||
      previewData?.applicationDocumentList ||
      previewData?.registrationDetails
        ?.documentDetails ||
      previewData?.registrationDetails
        ?.documents
  );

  /* =======================================================
     TABLE COLUMN COUNT
  ======================================================= */

  const tableColumnCount =
    (props.tableColumns?.length || 0) +
    2 +
    (showActionColumn ? 1 : 0) +
    (showDecisionColumn ? 1 : 0);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          STATUS TABS
      =================================================== */}

      <Box
        sx={{
          width: "100%",
          borderBottom:
            "1px solid #ddd",
          mb: 2,
        }}
      >
        <Tabs
          value={validSelectedTab}
          onChange={
            handleStatusTabChange
          }
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 48,

            "& .MuiTab-root": {
              minHeight: 48,
              textTransform:
                "none",
              fontWeight: 500,
              fontSize:
                "0.85rem",
            },

            "& .Mui-selected": {
              fontWeight: 700,
            },
          }}
        >
          {statusTabs.map(
            (tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Box
                    sx={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 1,
                    }}
                  >
                    <span>
                      {
                        tab.label
                      }
                    </span>

                    <Badge
                      badgeContent={
                        statusCounts[
                          tab.value
                        ] || 0
                      }
                      color="primary"
                      max={999}
                      sx={{
                        "& .MuiBadge-badge":
                          {
                            position:
                              "relative",
                            transform:
                              "none",
                            top:
                              "auto",
                            right:
                              "auto",
                            minWidth: 20,
                            height: 20,
                            borderRadius:
                              "10px",
                            fontSize:
                              "0.7rem",
                          },
                      }}
                    />
                  </Box>
                }
              />
            )
          )}
        </Tabs>
      </Box>

      {/* ===================================================
          TABLE
      =================================================== */}

      <Table
        stickyHeader
        sx={{
          minWidth: 650,
        }}
      >
        <TableHead>
          <TableRow>
            {props.tableColumns.map(
              (
                column,
                index
              ) => (
                <TableCell
                  key={
                    column.attr ||
                    index
                  }
                >
                  <TableSortLabel
                    onClick={() =>
                      props.handleSortClick(
                        column.attr
                      )
                    }
                    active={
                      column.attr ===
                      props
                        .sortAttributeDirection
                        .attr
                    }
                    direction={
                      column.attr ===
                      props
                        .sortAttributeDirection
                        .attr
                        ? props
                            .sortAttributeDirection
                            .direction
                        : "asc"
                    }
                  >
                    {
                      column.header
                    }
                  </TableSortLabel>
                </TableCell>
              )
            )}

            <TableCell>
              Preview
            </TableCell>

            <TableCell>
              Download
            </TableCell>

            {showActionColumn && (
              <TableCell>
                Action
              </TableCell>
            )}

            {showDecisionColumn && (
              <TableCell>
                Decision
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredRows.map(
            (
              row,
              index
            ) => {
              const applicationId =
                getApplicationId(
                  row
                );

              const currentStatus =
                getEffectiveStatus(
                  row
                );

              const forwarded =
                currentStatus ===
                "FORWARDED_TO_CVO";

              const isInspectionScheduled =
                currentStatus ===
                "INSPECTION_SCHEDULED";

              const inspectionCompleted =
                currentStatus ===
                  "VERIFIED_BY_CVO" ||
                currentStatus ===
                  "REJECTED_BY_CVO";

              const currentlyForwarding =
                forwardingId ===
                applicationId;

              const isFinalApproved =
                currentStatus ===
                "APPLICATION_APPROVED";

              const isFinalRejected =
                currentStatus ===
                "APPLICATION_REJECTED";

              return (
                <TableRow
                  key={
                    applicationId ||
                    index
                  }
                >
                  {/* TABLE COLUMNS */}

                  {props.tableColumns.map(
                    (
                      column,
                      columnIndex
                    ) => (
                      <TableCell
                        key={
                          column.attr ||
                          columnIndex
                        }
                      >
                        {column.attr ===
                        "status" ? (
                          getStatusLabel(
                            currentStatus
                          )
                        ) : typeof column.render ===
                          "function" ? (
                          column.render(
                            row
                          )
                        ) : (
                          String(
                            row?.[
                              column.attr
                            ] ?? ""
                          )
                        )}
                      </TableCell>
                    )
                  )}

                  {/* PREVIEW */}

                  <TableCell>
                    {[
                      "DOG_BREEDER",
                      "DOG-BREEDER",
                      "DOG BREEDER",
                    ].includes(
                      String(
                        row?.entityType ||
                          ""
                      ).toUpperCase()
                    ) ? (
                      <Tooltip
                        title="Preview Dog Breeder Application"
                      >
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handlePreviewClick(
                              row
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/* DOWNLOAD */}

                  <TableCell>
                    {[
                      "DOG_BREEDER",
                      "DOG-BREEDER",
                      "DOG BREEDER",
                    ].includes(
                      String(
                        row?.entityType ||
                          ""
                      ).toUpperCase()
                    ) ? (
                      <Tooltip
                        title="Download Dog Breeder Application"
                      >
                        <IconButton
                          color="success"
                          onClick={() =>
                            handleDownloadClick(
                              row
                            )
                          }
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  {/* ACTION COLUMN */}

                  {showActionColumn && (
                    <TableCell>
                      {/* ADMIN ACTION */}

                      {isAdmin &&
                        showForwardAction && (
                          <>
                            {currentStatus ===
                            "VERIFIED_BY_CVO" ? (
                              <Box
                                sx={{
                                  display:
                                    "flex",
                                  gap: 1,
                                  flexWrap:
                                    "wrap",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="success"
                                  disabled={
                                    isSubmitting
                                  }
                                  onClick={() =>
                                    handleSubmitDecision(
                                      "APPROVED",
                                      row
                                    )
                                  }
                                >
                                  APPROVE
                                </Button>

                                <Button
                                  variant="contained"
                                  size="small"
                                  color="error"
                                  disabled={
                                    isSubmitting
                                  }
                                  onClick={() =>
                                    handleSubmitDecision(
                                      "REJECTED",
                                      row
                                    )
                                  }
                                >
                                  REJECT
                                </Button>
                              </Box>
                            ) : isFinalRejected ? (
                              <Button
                                variant="contained"
                                size="small"
                                disabled
                                sx={{
                                  "&.Mui-disabled":
                                    {
                                      backgroundColor:
                                        "#ffebee",
                                      color:
                                        "#d32f2f",
                                      fontWeight:
                                        "bold",
                                    },
                                }}
                              >
                                REJECTED
                              </Button>
                            ) : isFinalApproved ? (
                              <Button
                                variant="contained"
                                size="small"
                                disabled
                                sx={{
                                  "&.Mui-disabled":
                                    {
                                      backgroundColor:
                                        "#e8f5e9",
                                      color:
                                        "#2e7d32",
                                      fontWeight:
                                        "bold",
                                    },
                                }}
                              >
                                APPROVED
                              </Button>
                            ) : currentStatus ===
                              "REJECTED_BY_CVO" ? (
                              <Button
                                variant="contained"
                                size="small"
                                disabled
                                sx={{
                                  "&.Mui-disabled":
                                    {
                                      backgroundColor:
                                        "#ffebee",
                                      color:
                                        "#d32f2f",
                                      fontWeight:
                                        "bold",
                                    },
                                }}
                              >
                                REJECTED BY CVO
                              </Button>
                            ) : isInspectionScheduled ? (
                              <Button
                                variant="contained"
                                size="small"
                                disabled
                                sx={{
                                  "&.Mui-disabled":
                                    {
                                      backgroundColor:
                                        "#e0e0e0",
                                      color:
                                        "#757575",
                                    },
                                }}
                              >
                                INSPECTION
                                {" "}
                                SCHEDULED
                              </Button>
                            ) : forwarded ? (
                              <Button
                                variant="contained"
                                size="small"
                                disabled
                                sx={{
                                  "&.Mui-disabled":
                                    {
                                      backgroundColor:
                                        "#e0e0e0",
                                      color:
                                        "#757575",
                                    },
                                }}
                              >
                                FORWARDED TO CVO
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                disabled={
                                  currentlyForwarding ||
                                  inspectionCompleted ||
                                  (
                                    currentStatus !==
                                      "SUBMITTED" &&
                                    currentStatus !==
                                      "RESUBMITTED"
                                  )
                                }
                                onClick={() =>
                                  handleForwardClick(
                                    row
                                  )
                                }
                              >
                                {currentlyForwarding
                                  ? "FORWARDING..."
                                  : "FORWARD"}
                              </Button>
                            )}
                          </>
                        )}

                      {/* CVO ACTION */}

                      {isCvo &&
                        showScheduleInspectionAction && (
                          <>
                            {isInspectionScheduled ? (
                              <Button
                                variant="contained"
                                size="small"
                                disabled
                                sx={{
                                  "&.Mui-disabled":
                                    {
                                      backgroundColor:
                                        "#e0e0e0",
                                      color:
                                        "#757575",
                                    },
                                }}
                              >
                                INSPECTION
                                {" "}
                                SCHEDULED
                              </Button>
                            ) : currentStatus ===
                              "VERIFIED_BY_CVO" ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                disabled
                              >
                                VERIFIED BY CVO
                              </Button>
                            ) : currentStatus ===
                              "REJECTED_BY_CVO" ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                disabled
                              >
                                REJECTED BY CVO
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                color="info"
                                startIcon={
                                  <EventIcon />
                                }
                                disabled={
                                  inspectionCompleted ||
                                  ![
                                    "FORWARDED_TO_CVO",
                                    "RESUBMITTED",
                                  ].includes(
                                    currentStatus
                                  )
                                }
                                onClick={() =>
                                  handleOpenScheduleModal(
                                    row
                                  )
                                }
                              >
                                Schedule Inspection
                              </Button>
                            )}
                          </>
                        )}
                    </TableCell>
                  )}

                  {/* CVO DECISION */}

                  {showDecisionColumn && (
                    <TableCell>
                      {inspectionCompleted ? (
                        <Button
                          variant="contained"
                          size="small"
                          color={
                            currentStatus ===
                            "VERIFIED_BY_CVO"
                              ? "success"
                              : "error"
                          }
                          disabled
                          sx={{
                            "&.Mui-disabled":
                              {
                                color:
                                  "#ffffff",
                                backgroundColor:
                                  currentStatus ===
                                  "VERIFIED_BY_CVO"
                                    ? "#2e7d32"
                                    : "#d32f2f",
                                opacity:
                                  0.8,
                              },
                          }}
                        >
                          {currentStatus ===
                          "VERIFIED_BY_CVO"
                            ? "VERIFIED BY CVO"
                            : "REJECTED BY CVO"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          disabled={
                            !isCvo ||
                            !isInspectionScheduled
                          }
                          onClick={() =>
                            handleUploadReportClick(
                              row
                            )
                          }
                        >
                          Upload Reports
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            }
          )}

          {/* NO DATA */}

          {filteredRows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={
                  tableColumnCount
                }
                align="center"
                sx={{
                  py: 4,
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  No applications found
                  {" "}
                  for{" "}
                  {
                    statusTabs.find(
                      (tab) =>
                        tab.value ===
                        validSelectedTab
                    )?.label
                  }
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ===================================================
          SCHEDULE INSPECTION DIALOG
      =================================================== */}

      <Dialog
        open={scheduleModalOpen}
        onClose={
          handleCloseScheduleModal
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Schedule Inspection
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display:
                "flex",
              flexDirection:
                "column",
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              label="Inspection Date"
              type="date"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={
                inspectionDate
              }
              onChange={(event) =>
                setInspectionDate(
                  event.target
                    .value
                )
              }
              inputProps={{
                min:
                  getTodayLocalDate(),
              }}
            />

            <TextField
              label="Remarks"
              multiline
              rows={3}
              fullWidth
              value={
                inspectionRemarks
              }
              onChange={(event) =>
                setInspectionRemarks(
                  event.target
                    .value
                )
              }
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleCloseScheduleModal
            }
            disabled={
              isScheduling
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={
              handleSaveInspection
            }
            disabled={
              isScheduling ||
              !inspectionDate
            }
          >
            {isScheduling
              ? "Saving..."
              : "Save Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================
          UPLOAD REPORT DIALOG
      =================================================== */}

      <Dialog
        open={uploadReportOpen}
        onClose={
          handleCloseUploadReport
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upload Inspection Report &
          Submit Recommendation
        </DialogTitle>

        <DialogContent dividers>
          <Box
            sx={{
              display:
                "flex",
              flexDirection:
                "column",
              gap: 2,
              pt: 1,
            }}
          >
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Select Inspection Report File

              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) => {
                  const file =
                    event.target
                      .files?.[0] ||
                    null;

                  setInspectionReport(
                    file
                  );
                }}
              />
            </Button>

            {inspectionReport && (
              <Typography
                variant="caption"
                sx={{
                  wordBreak:
                    "break-word",
                }}
              >
                Selected file:{" "}
                {
                  inspectionReport.name
                }
              </Typography>
            )}

            {existingReport && (
              <Typography
                variant="caption"
                color="success.main"
              >
                Existing inspection report is
                already uploaded.
              </Typography>
            )}

            <TextField
              label="Inspection Remarks"
              multiline
              rows={3}
              fullWidth
              value={remarks}
              onChange={(event) =>
                setRemarks(
                  event.target
                    .value
                )
              }
            />

            <TextField
              label="Recommendation Details"
              multiline
              rows={2}
              fullWidth
              value={
                recommendation
              }
              onChange={(event) =>
                setRecommendation(
                  event.target
                    .value
                )
              }
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleCloseUploadReport
            }
            disabled={
              isSubmitting
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={
              isSubmitting ||
              (!inspectionReport &&
                !existingReport)
            }
            onClick={() =>
              handleSubmitDecision(
                "REJECTED"
              )
            }
          >
            {isSubmitting
              ? "Processing..."
              : "Reject (CVO)"}
          </Button>

          <Button
            variant="contained"
            color="success"
            disabled={
              isSubmitting ||
              (!inspectionReport &&
                !existingReport)
            }
            onClick={() =>
              handleSubmitDecision(
                "APPROVED"
              )
            }
          >
            {isSubmitting
              ? "Processing..."
              : "Verify & Approve (CVO)"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===================================================
          APPLICATION PREVIEW DIALOG
      =================================================== */}

      <Dialog
        open={previewOpen}
        onClose={
          handleClosePreview
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Dog Breeder Application Details -{" "}
          {registration.applicationNumber ||
            "-"}
        </DialogTitle>

        <DialogContent dividers>
          {previewLoading ? (
            <Box
              sx={{
                display:
                  "flex",
                justifyContent:
                  "center",
                my: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
             {/* REGISTRATION */}

<SectionTitle>
  Registration Details
</SectionTitle>

<Grid
  container
  spacing={2}
>
  <PreviewRow
    label="Application Number"
    value={
      registration.applicationNumber
    }
  />

  <PreviewRow
    label="District"
    value={
      registration.districtName ||
      registration.district
    }
  />

  <PreviewRow
    label="Breeder Name"
    value={
      breeder?.breederName ||
      breeder?.name ||
      breeder?.breeder_name
    }
  />

  <PreviewRow
    label="Address Line 1"
    value={
      breeder?.addressLine1 ||
      breeder?.address_line1
    }
  />

  <PreviewRow
    label="Address Line 2"
    value={
      breeder?.addressLine2 ||
      breeder?.address_line2
    }
  />

  <PreviewRow
    label="City"
    value={
      breeder?.city
    }
  />

  <PreviewRow
    label="Pincode"
    value={
      breeder?.pincode
    }
  />

  <PreviewRow
    label="Contact Mobile"
    value={
      breeder?.contactMobile ||
      breeder?.mobileNumber ||
      breeder?.contact_mobile
    }
  />

  <PreviewRow
    label="Contact Email"
    value={
      breeder?.contactEmail ||
      breeder?.email ||
      breeder?.contact_email
    }
  />

  <PreviewRow
    label="Facility Details"
    value={
      breeder?.facilityDetails ||
      breeder?.facility_details
    }
  />

  <PreviewRow
    label="Total Dogs Count"
    value={
      breeder?.totalDogsCount ??
      breeder?.total_dogs_count
    }
  />

  <PreviewRow
    label="Application Status"
    value={getStatusLabel(
      getRowStatus(previewData)
    )}
  />
</Grid>

              {/* FACILITY */}

<SectionTitle>
  Facility Details
</SectionTitle>

<Grid
  container
  spacing={2}
>
  <PreviewRow
    label="Accommodation / Infrastructure"
    value={
      facility.accommodationInfrastructure ??
      facility.accommodation_infrastructure ??
      ""
    }
  />

  <PreviewRow
    label="Working Hours"
    value={
      facility.workingHours ??
      facility.working_hours ??
      ""
    }
  />

  <PreviewRow
    label="Holiday"
    value={
      facility.holiday ?? ""
    }
  />

  <PreviewRow
    label="Ventilation Available"
    value={
      facility.ventilationAvailable ??
      facility.ventilation_available ??
      false
        ? "Yes"
        : "No"
    }
  />


  <PreviewRow
    label="Lighting Available"
    value={
      facility.lightingAvailable ??
      facility.lighting_available ??
      false
        ? "Yes"
        : "No"
    }
  />


  <PreviewRow
    label="Heating / Cooling Available"
    value={
      facility.heatingCoolingAvailable ??
      facility.heating_cooling_available ??
      false
        ? "Yes"
        : "No"
    }
  />

  <PreviewRow
    label="Food Storage Available"
    value={
      facility.foodStorageAvailable ??
      facility.food_storage_available ??
      false
        ? "Yes"
        : "No"
    }
  />

  <PreviewRow
    label="Cleanliness / Waste Management Available"
    value={
      facility.cleanlinessWasteAvailable ??
      facility.cleanliness_waste_available ??
      false
        ? "Yes"
        : "No"
    }
  />


  <PreviewRow
    label="Dead Animal Disposal Available"
    value={
      facility.deadAnimalDisposalAvailable ??
      facility.dead_animal_disposal_available ??
      false
        ? "Yes"
        : "No"
    }
  />


  <PreviewRow
    label="Veterinary Support Available"
    value={
      facility.veterinarySupportAvailable ??
      facility.veterinary_support_available ??
      false
        ? "Yes"
        : "No"
    }
  />



  <PreviewRow
    label="Cage / Enclosure Details"
    value={
      facility.cageEnclosureDetails ??
      facility.cage_enclosure_details ??
      ""
    }
  />
</Grid>
            {/* BREEDS */}

{breeds.length > 0 && (
  <>
    <SectionTitle>
      Breed Details
    </SectionTitle>

    <Grid
      container
      spacing={2}
    >
      {breeds.map((breed, idx) => {
        const breedName =
          breed?.breedName ??
          breed?.breed_name ??
          breed?.name ??
          "-";

        const dogCount =
          breed?.dogCount ??
          breed?.dog_count ??
          0;

        const gender =
          breed?.gender ??
          "-";

        const ageDescription =
          breed?.ageDescription ??
          breed?.age_description ??
          "-";

        return (
          <Grid
            item
            xs={12}
            key={breed?.id ?? idx}
          >
            {/* Breed Number */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
              }}
            >
              Breed {idx + 1}
            </Typography>

            {/* Breed Details in One Row */}
            <Grid
              container
              spacing={2}
            >
           
                <PreviewRow
                  label="Breed Name"
                  value={breedName}
                />
             
                <PreviewRow
                  label="Dog Count"
                  value={dogCount}
                />
              
                <PreviewRow
                  label="Gender"
                  value={gender}
                />

                <PreviewRow
                  label="Age Description"
                  value={ageDescription}
                />
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  </>
)}
              {/* DOCUMENTS */}

              {documents.length > 0 && (
                <>
                  <SectionTitle>
                    Uploaded Documents
                  </SectionTitle>

                  <Table
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Document Type
                        </TableCell>

                        <TableCell>
                          File Name
                        </TableCell>

                        <TableCell align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {documents.map(
                        (
                          doc,
                          idx
                        ) => (
                          <TableRow
                            key={
                              doc?.id ||
                              idx
                            }
                          >
                            <TableCell>
                              {doc?.documentTypeName ||
                                doc?.documentType?.name ||
                                doc?.documentType ||
                                "-"}
                            </TableCell>

                            <TableCell>
                              {doc?.fileName ||
                                doc?.name ||
                                "-"}
                            </TableCell>

                            <TableCell align="right">
                              <Tooltip title="View Document">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    handleViewDocument(
                                      doc
                                    )
                                  }
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Download Document">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() =>
                                    handleDownloadDocument(
                                      doc
                                    )
                                  }
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleClosePreview
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/* =========================================================
   PROP TYPES
========================================================= */

List.propTypes = {
  rows: PropTypes.array,

  tableColumns:
    PropTypes.array.isRequired,

  handleSortClick:
    PropTypes.func.isRequired,

  sortAttributeDirection:
    PropTypes.shape({
      attr:
        PropTypes.string,
      direction:
        PropTypes.string,
    }).isRequired,

  showForwardAction:
    PropTypes.bool,

  showScheduleInspectionAction:
    PropTypes.bool,

  showDecisionColumn:
    PropTypes.bool,

  refreshList:
    PropTypes.func,

  handleRefresh:
    PropTypes.func,
};

/* =========================================================
   DEFAULT PROPS
========================================================= */

List.defaultProps = {
  rows: [],

  showForwardAction:
    undefined,

  showScheduleInspectionAction:
    undefined,

  showDecisionColumn:
    undefined,

  refreshList:
    undefined,

  handleRefresh:
    undefined,
};

export default List;