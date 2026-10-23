import PropTypes from "prop-types";
import { useState } from "react";

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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import EventIcon from "@mui/icons-material/Event";

import { toast } from "material-react-toastify";

import { getUserAttributes } from "../../utils";
import InspectionReportDialog from "./InspectionReportDialog";
import Step6Preview from "../dog_breeder_register/Step6Preview";

import {
  getAdminDogBreederApplicationPreview,
  downloadDogBreederApplication,
  forwardDogBreederApplication,
  saveDogBreederInspection,
  uploadDogBreederInspectionReport,
  getDogBreederInspection,
  approveDogBreederApplication,
  rejectDogBreederApplication,
} from "../../api-client/adminDogBreederApplication";

/* =========================================================
   COMMON HELPERS
   ========================================================= */

const getApplicationId = (row) =>
  row?.id ??
  row?.applicationId ??
  row?.registrationApplicationId ??
  row?.registration_application_id ??
  row?.registrationDetails?.id ??
  row?.registrationDetails?.applicationId ??
  null;

const getPayload = (response) =>
  response?.data?.payLoad ??
  response?.data?.payload ??
  response?.payLoad ??
  response?.payload ??
  response?.data ??
  response ??
  {};

const displayValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "-";
    }

    return value
      .map((item) => displayValue(item))
      .filter((item) => item !== "-")
      .join(", ");
  }

  if (typeof value === "object") {
    const preferredKeys = [
      "name",
      "label",
      "displayName",
      "description",
      "statusName",
      "statusCode",
      "code",
      "value",
      "title",
      "fileName",
      "applicationNumber",
      "breederName",
      "establishmentName",
      "breedName",
      "breed",
    ];

    for (const key of preferredKeys) {
      const item = value?.[key];

      if (
        item !== null &&
        item !== undefined &&
        item !== "" &&
        typeof item !== "object"
      ) {
        return String(item);
      }
    }

    if (
      value?.name &&
      typeof value.name === "object"
    ) {
      return displayValue(value.name);
    }

    if (
      value?.breed &&
      typeof value.breed === "object"
    ) {
      return displayValue(value.breed);
    }

    if (
      value?.id !== null &&
      value?.id !== undefined
    ) {
      return String(value.id);
    }

    try {
      return JSON.stringify(value);
    } catch {
      return "-";
    }
  }

  return String(value);
};

const getArray = (value) =>
  Array.isArray(value) ? value : [];

/* =========================================================
   STATUS HELPERS
   ========================================================= */

const normalizeStatus = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (typeof value === "object") {
    value =
      value?.statusCode ??
      value?.code ??
      value?.name ??
      value?.statusName ??
      value?.label ??
      value?.value ??
      "";
  }

  return String(value)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
};

const getStatusValue = (row) => {
  const status = row?.status;

  if (typeof status === "string") {
    return status;
  }

  if (
    status &&
    typeof status === "object"
  ) {
    return (
      status?.statusCode ??
      status?.code ??
      status?.name ??
      status?.statusName ??
      status?.label ??
      status?.value ??
      ""
    );
  }

  return (
    row?.statusName ??
    row?.statusCode ??
    row?.applicationStatusName ??
    row?.applicationStatusCode ??
    ""
  );
};

const getStatusId = (row) =>
  row?.status?.id ??
  row?.statusId ??
  row?.applicationStatusId ??
  row?.registrationStatusId ??
  null;

const getCurrentStatus = (row) => {
  const status = normalizeStatus(
    getStatusValue(row)
  );

  if (status) {
    return status;
  }

  const statusId = Number(
    getStatusId(row)
  );

  switch (statusId) {
    case 1:
      return "DRAFT";

    case 5:
      return "FORWARDED_TO_CVO";

    default:
      return "";
  }
};

/* =========================================================
   STATUS CHECKS
   ========================================================= */

const isDraft = (row) => {
  const status = getCurrentStatus(row);

  if (status === "DRAFT") {
    return true;
  }

  if (status === "INCOMPLETE") {
    return true;
  }

  return Number(getStatusId(row)) === 1;
};

const isSubmitted = (row) => {
  const status = getCurrentStatus(row);

  return (
    status === "APPLICATION_SUBMITTED" ||
    status === "SUBMITTED" ||
    status === "RESUBMITTED"
  );
};



/* =========================================================
   ROLE HELPERS
   ========================================================= */

const normalizeRole = (role) =>
  String(role ?? "")
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "");

const getLoggedInRoles = () => {
  const user = getUserAttributes();

  if (!user) {
    return [];
  }

  const roleValues = [
    user?.role,
    user?.roleName,
    user?.role?.name,
    user?.role?.roleName,
    user?.role?.authority,
    user?.authority,
  ];

  if (Array.isArray(user?.roles)) {
    roleValues.push(
      ...user.roles
    );
  }

  if (
    Array.isArray(
      user?.authorities
    )
  ) {
    roleValues.push(
      ...user.authorities
    );
  }

  return roleValues
    .flatMap((role) => {
      if (typeof role === "string") {
        return [role];
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
   MAIN LIST
   ========================================================= */

const List = (props) => {
  /* =======================================================
     PREVIEW STATE
     ======================================================= */

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false);

  const [
    previewLoading,
    setPreviewLoading,
  ] = useState(false);

  const [
    previewData,
    setPreviewData,
  ] = useState(null);

  /* =======================================================
     FORWARD STATE
     ======================================================= */

  const [
    forwardingId,
    setForwardingId,
  ] = useState(null);

  const [
    locallyForwardedIds,
    setLocallyForwardedIds,
  ] = useState(new Set());

  /* =======================================================
     INSPECTION STATE
     ======================================================= */

  const [
    scheduleModalOpen,
    setScheduleModalOpen,
  ] = useState(false);

  const [
    selectedRowForInspection,
    setSelectedRowForInspection,
  ] = useState(null);

  const [
    inspectionDate,
    setInspectionDate,
  ] = useState("");

  const [
    inspectionRemarks,
    setInspectionRemarks,
  ] = useState("");

  const [
    isScheduling,
    setIsScheduling,
  ] = useState(false);

  const [
    reportApplicationId,
    setReportApplicationId,
  ] = useState(null);

  const [
    scheduledInspectionIds,
    setScheduledInspectionIds,
  ] = useState(new Set());

  /* =======================================================
     REPORT STATE
     ======================================================= */

  const [
    uploadReportOpen,
    setUploadReportOpen,
  ] = useState(false);

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState(null);

  const [
    inspectionReport,
    setInspectionReport,
  ] = useState(null);

  const [
    existingReport,
    setExistingReport,
  ] = useState(null);

  const [
    remarks,
    setRemarks,
  ] = useState("");

  const [
    recommendation,
    setRecommendation,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  /* =======================================================
     LOCAL STATUS
     ======================================================= */

  const [
    completedInspections,
    setCompletedInspections,
  ] = useState({});

  /* =======================================================
     ROLES
     ======================================================= */

  const loggedInRoles =
    getLoggedInRoles();

  const isAdmin =
    loggedInRoles.includes("ADMIN");

  const isCvo =
    loggedInRoles.includes("CVO") ||
    loggedInRoles.includes("DISTRICT_OFFICER");

  /* =======================================================
     ROWS
     ======================================================= */

  const submittedRows =
    getArray(props.rows).filter(
      (row) => !isDraft(row)
    );

  /* =======================================================
     ACTION VISIBILITY
     ======================================================= */

  const showForwardAction =
    typeof props.showForwardAction ===
    "boolean"
      ? props.showForwardAction
      : isAdmin && !isCvo;

  const showScheduleInspectionAction =
    typeof props.showScheduleInspectionAction ===
    "boolean"
      ? props.showScheduleInspectionAction
      : isCvo;

  const showActionColumn =
    showForwardAction ||
    showScheduleInspectionAction;

  const showDecisionColumn =
    isCvo;

  /* =======================================================
     REFRESH
     ======================================================= */

  const refreshList = async () => {
    if (
      typeof props.refreshList ===
      "function"
    ) {
      await props.refreshList();
      return;
    }

    if (
      typeof props.handleRefresh ===
      "function"
    ) {
      await props.handleRefresh();
    }
  };

  /* =======================================================
     GET EFFECTIVE STATUS
     ======================================================= */

  const getEffectiveStatus = (
    row
  ) => {
    const applicationId =
      getApplicationId(row);

    if (
      applicationId &&
      completedInspections[
        applicationId
      ]
    ) {
      return completedInspections[
        applicationId
      ];
    }

    if (
      applicationId &&
      scheduledInspectionIds.has(
        applicationId
      )
    ) {
      return "INSPECTION_SCHEDULED";
    }

    if (
      applicationId &&
      locallyForwardedIds.has(
        applicationId
      )
    ) {
      return "FORWARDED_TO_CVO";
    }

    return getCurrentStatus(row);
  };

  const [activeTab, setActiveTab] = useState("ALL");

  const roleTabs = (() => {
    if (isAdmin) {
      return [
        { key: "ALL", label: "All" },
        { key: "SUBMITTED", label: "Submitted" },
        { key: "RESUBMITTED", label: "Resubmitted" },
        { key: "FORWARDED_TO_CVO", label: "Forwarded" },
        { key: "INSPECTION_SCHEDULED", label: "Inspection Scheduled" },
        { key: "VERIFIED_BY_CVO", label: "Verified by CVO" },
        { key: "REJECTED_BY_CVO", label: "Rejected by CVO" },
        { key: "APPLICATION_APPROVED", label: "Approved" },
        { key: "APPLICATION_REJECTED", label: "Rejected" },
      ];
    }

    if (isCvo) {
      return [
        { key: "ALL", label: "All" },
        { key: "FORWARDED_TO_CVO", label: "Forwarded to CVO" },
        { key: "INSPECTION_SCHEDULED", label: "Inspection Scheduled" },
        { key: "VERIFIED_BY_CVO", label: "Verified by CVO" },
        { key: "REJECTED_BY_CVO", label: "Rejected by CVO" },
        { key: "RESUBMITTED", label: "Resubmitted" },
      ];
    }

    return [
      { key: "ALL", label: "All" },
      { key: "APPLICATION_SUBMITTED", label: "Submitted" },
      { key: "RESUBMITTED", label: "Resubmitted" },
      { key: "APPLICATION_REJECTED", label: "Rejected" },
      { key: "APPLICATION_APPROVED", label: "Approved" },
    ];
  })();

  const roleStatusCounts = {};

  submittedRows.forEach((row) => {
    const value = normalizeStatus(getEffectiveStatus(row));

    if (value) {
      roleStatusCounts[value] = (roleStatusCounts[value] || 0) + 1;
    }
  });

  const visibleRows =
    activeTab === "ALL"
      ? submittedRows
      : submittedRows.filter((row) => {
          const value = normalizeStatus(getEffectiveStatus(row));
          return value === activeTab;
        });

  /* =======================================================
     PREVIEW
     ======================================================= */

  const handlePreviewClick =
    async (row) => {
      const applicationId =
        getApplicationId(row);

      if (!applicationId) {
        toast.error(
          "Application ID missing"
        );
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

        const payload =
          getPayload(response);

        if (
          payload &&
          typeof payload ===
            "object"
        ) {
          setPreviewData({
            ...row,
            ...payload,
          });
        }
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

  const handleClosePreview =
    () => {
      setPreviewOpen(false);
      setPreviewData(null);
    };

  /* =======================================================
     DOWNLOAD APPLICATION
     ======================================================= */

  const handleDownloadClick =
    async (row) => {
      const applicationId =
        getApplicationId(row);

      if (!applicationId) {
        toast.error(
          "Application ID missing"
        );
        return;
      }

      try {
        const response =
          await downloadDogBreederApplication(
            applicationId
          );

        const contentType =
          response.headers?.[
            "content-type"
          ] || "application/zip";

        const disposition =
          response.headers?.[
            "content-disposition"
          ] || "";

        const fileNameMatch =
          disposition.match(
            /filename="?([^"]+)"?/i
          );

        const isPdf =
          contentType.includes("pdf");

        const blob =
          new Blob(
            [response.data],
            {
              type: contentType,
            }
          );

        const url =
          URL.createObjectURL(
            blob
          );

        const applicationNumber =
          displayValue(
            row?.applicationNumber
          );

        const extension = isPdf
          ? "pdf"
          : "zip";

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          fileNameMatch?.[1] ||
          (applicationNumber !== "-"
            ? `${applicationNumber}.${extension}`
            : `dog-breeder-application-${applicationId}.${extension}`);

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        setTimeout(() => {
          URL.revokeObjectURL(
            url
          );
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
     ADMIN -> FORWARD TO CVO
     ======================================================= */

  const handleForwardClick =
    async (row) => {
      const applicationId =
        getApplicationId(row);

      if (!applicationId) {
        toast.error(
          "Application ID missing"
        );
        return;
      }

      const currentStatus =
        getEffectiveStatus(row);

      if (
        currentStatus ===
          "FORWARDED_TO_CVO" ||
        currentStatus ===
          "FORWARDED"
      ) {
        toast.info(
          "Application is already forwarded to CVO"
        );
        return;
      }

      if (
        currentStatus ===
          "INSPECTION_SCHEDULED" ||
        currentStatus ===
          "VERIFIED_BY_CVO" ||
        currentStatus ===
          "REJECTED_BY_CVO" ||
        currentStatus ===
          "APPLICATION_APPROVED" ||
        currentStatus ===
          "APPLICATION_REJECTED"
      ) {
        toast.info(
          "Application has already moved to the CVO processing stage"
        );
        return;
      }

      if (
        !isSubmitted(row)
      ) {
        toast.info(
          "Only submitted or resubmitted applications can be forwarded to CVO"
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
          (previousIds) =>
            new Set([
              ...previousIds,
              applicationId,
            ])
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

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to forward application to CVO"
        );
      } finally {
        setForwardingId(null);
      }
    };

  /* =======================================================
     OPEN SCHEDULE MODAL
     ======================================================= */

  const handleOpenScheduleModal =
    (row) => {
      const currentStatus =
        getEffectiveStatus(row);

      if (
        currentStatus !==
        "FORWARDED_TO_CVO"
      ) {
        toast.info(
          "Only forwarded applications can be scheduled for inspection"
        );
        return;
      }

      setSelectedRowForInspection(
        row
      );

      setInspectionDate("");
      setInspectionRemarks("");

      setScheduleModalOpen(true);
    };

  /* =======================================================
     CLOSE SCHEDULE MODAL
     ======================================================= */

  const handleCloseScheduleModal =
    () => {
      if (isScheduling) {
        return;
      }

      setScheduleModalOpen(false);

      setSelectedRowForInspection(
        null
      );

      setInspectionDate("");
      setInspectionRemarks("");
    };

  /* =======================================================
     SAVE INSPECTION
     ======================================================= */

  const handleSaveInspection =
    async () => {
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

      const currentStatus =
        getEffectiveStatus(
          selectedRowForInspection
        );

      if (
        currentStatus !==
        "FORWARDED_TO_CVO"
      ) {
        toast.error(
          "Only forwarded applications can be scheduled"
        );
        return;
      }

      try {
        setIsScheduling(true);

        await saveDogBreederInspection(
          {
            applicationId,
            inspectionDate,
            inspectionRemarks,
          }
        );

        setScheduledInspectionIds(
          (previous) =>
            new Set([
              ...previous,
              applicationId,
            ])
        );

        toast.success(
          "Inspection Scheduled Successfully"
        );

        setScheduleModalOpen(
          false
        );

        setSelectedRowForInspection(
          null
        );

        setInspectionDate("");
        setInspectionRemarks("");

        await refreshList();
      } catch (error) {
        console.error(
          "Schedule inspection error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Unable to schedule inspection"
        );
      } finally {
        setIsScheduling(false);
      }
    };

  /* =======================================================
     OPEN UPLOAD REPORT
     ======================================================= */

  const handleUploadReportClick =
    async (row) => {
      const applicationId =
        getApplicationId(row);

      if (!applicationId) {
        toast.error(
          "Application ID missing"
        );
        return;
      }

      const currentStatus =
        getEffectiveStatus(row);

      if (
        currentStatus !==
        "INSPECTION_SCHEDULED"
      ) {
        toast.info(
          "Please schedule the inspection before uploading the report"
        );
        return;
      }

      setSelectedApplication(row);

      setInspectionReport(null);
      setExistingReport(null);
      setRemarks("");
      setRecommendation("");

      try {
        const response =
          await getDogBreederInspection(
            applicationId
          );

        const data =
          getPayload(response);

        if (
          data &&
          typeof data === "object"
        ) {
          setExistingReport(
            data?.inspectionReport ??
              data?.report ??
              data?.inspectionReportFile ??
              null
          );

          const existingRemarks =
            displayValue(
              data?.inspectionRemarks ??
                data?.remarks
            );

          setRemarks(
            existingRemarks === "-"
              ? ""
              : existingRemarks
          );

          const existingRecommendation =
            displayValue(
              data?.recommendation
            );

          setRecommendation(
            existingRecommendation ===
              "-"
              ? ""
              : existingRecommendation
          );
        }
      } catch (error) {
        console.error(
          "Get inspection error:",
          error
        );
      }

      setUploadReportOpen(true);
    };

  /* =======================================================
     CLOSE UPLOAD REPORT
     ======================================================= */

  const handleCloseUploadReport =
    () => {
      if (isSubmitting) {
        return;
      }

      setUploadReportOpen(false);

      setSelectedApplication(
        null
      );

      setInspectionReport(null);
      setExistingReport(null);
      setRemarks("");
      setRecommendation("");
    };

  /* =======================================================
     CVO VERIFY / REJECT / ADMIN APPROVE / REJECT
     ======================================================= */

  const handleSubmitDecision =
    async (
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
            "Admin can approve or reject only after CVO verification"
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
          } else if (
            decisionStatus ===
            "REJECTED"
          ) {
            await rejectDogBreederApplication(
              applicationId
            );
          } else {
            return;
          }

          const finalStatus =
            decisionStatus ===
            "APPROVED"
              ? "APPLICATION_APPROVED"
              : "APPLICATION_REJECTED";

          setCompletedInspections(
            (previous) => ({
              ...previous,
              [applicationId]:
                finalStatus,
            })
          );

          toast.success(
            decisionStatus ===
              "APPROVED"
              ? "Application approved successfully"
              : "Application rejected successfully"
          );

          await refreshList();
        } catch (error) {
          console.error(
            "Admin final decision error:",
            error
          );

          toast.error(
            error?.response?.data
              ?.message ||
              "Failed to process final application decision"
          );
        } finally {
          setIsSubmitting(false);
        }

        return;
      }

      /* =====================================================
         CVO DECISION
         ===================================================== */

      const currentStatus =
        getEffectiveStatus(
          appRow
        );

      if (
        currentStatus !==
        "INSPECTION_SCHEDULED"
      ) {
        toast.error(
          "Inspection must be scheduled before submitting the report"
        );
        return;
      }

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
        !recommendation.trim()
      ) {
        toast.error(
          "Please enter recommendation details"
        );
        return;
      }

      try {
        setIsSubmitting(true);

        const formData =
          new FormData();

        formData.append(
          "applicationId",
          String(applicationId)
        );

        if (inspectionReport) {
          formData.append(
            "reportFile",
            inspectionReport
          );
        }

        const cleanRemarks =
          remarks.trim();

        formData.append(
          "remarks",
          cleanRemarks
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

        const nextStatus =
          decisionStatus ===
          "APPROVED"
            ? "VERIFIED_BY_CVO"
            : "REJECTED_BY_CVO";

        setCompletedInspections(
          (previous) => ({
            ...previous,
            [applicationId]:
              nextStatus,
          })
        );

        toast.success(
          decisionStatus ===
            "APPROVED"
            ? "Inspection report submitted and application verified by CVO"
            : "Inspection report submitted and application rejected by CVO"
        );

        handleCloseUploadReport();

        await refreshList();
      } catch (error) {
        console.error(
          "CVO inspection decision error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to submit inspection report"
        );
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
    registration?.breederDetails ||
    {};

  const facility =
    previewData?.facilityDetails &&
    typeof previewData.facilityDetails === "object"
      ? previewData.facilityDetails
      : registration?.facilityDetails &&
          typeof registration.facilityDetails === "object"
        ? registration.facilityDetails
        : {};

  const declaration =
    previewData?.declarationDetails ||
    registration?.declarationDetails ||
    {};

  const breeds =
    getArray(
      previewData?.breedDetails
    ).length > 0
      ? getArray(
          previewData?.breedDetails
        )
      : getArray(
          registration?.breedDetails
        ).length > 0
      ? getArray(
          registration?.breedDetails
        )
      : getArray(
          previewData?.breeds
        ).length > 0
      ? getArray(
          previewData?.breeds
        )
      : getArray(
          registration?.breeds
        );

  const documents =
    getArray(
      previewData?.documentDetails
    ).length > 0
      ? getArray(
          previewData?.documentDetails
        )
      : getArray(
          previewData?.documents
        ).length > 0
      ? getArray(
          previewData?.documents
        )
      : getArray(
          previewData?.applicationDocuments
        ).length > 0
      ? getArray(
          previewData?.applicationDocuments
        )
      : getArray(
          previewData?.applicationDocumentList
        ).length > 0
      ? getArray(
          previewData?.applicationDocumentList
        )
      : getArray(
          registration?.documentDetails
        ).length > 0
      ? getArray(
          registration?.documentDetails
        )
      : getArray(
          registration?.documents
        );

  /* =======================================================
     STATUS LABEL
     ======================================================= */

  const getStatusLabel = (
    status
  ) => {
    switch (status) {
      case "APPLICATION_SUBMITTED":
      case "SUBMITTED":
        return "Submitted";

      case "RESUBMITTED":
        return "Resubmitted";

      case "FORWARDED_TO_CVO":
      case "FORWARDED":
        return "Forwarded to CVO";

      case "INSPECTION_SCHEDULED":
        return "Inspection Scheduled";

      case "VERIFIED_BY_CVO":
        return "Verified by CVO";

      case "REJECTED_BY_CVO":
        return "Rejected by CVO";

      case "APPLICATION_APPROVED":
      case "APPROVED":
        return "Application Approved";

      case "APPLICATION_REJECTED":
      case "REJECTED":
        return "Application Rejected";

      case "DRAFT":
        return "Draft";

      default:
        return displayValue(
          status
        );
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {roleTabs.map((tab) => (
          <Tab
            key={tab.key}
            value={tab.key}
            label={`${tab.label} (${tab.key === "ALL" ? submittedRows.length : roleStatusCounts[tab.key] || 0})`}
          />
        ))}
      </Tabs>

      <Table
        stickyHeader
        sx={{
          minWidth: 650,
        }}
      >
        <TableHead>
          <TableRow>
            {getArray(
              props.tableColumns
            ).map(
              (
                column,
                index
              ) => (
                <TableCell
                  key={
                    column?.attr ||
                    index
                  }
                >
                  <TableSortLabel
                    onClick={props.handleSortClick(
                      column.attr
                    )}
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
                    {displayValue(
                      column.header
                    )}
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
          {visibleRows.map(
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
                  "FORWARDED_TO_CVO" ||
                currentStatus ===
                  "FORWARDED";

              const isInspectionScheduled =
                currentStatus ===
                "INSPECTION_SCHEDULED";

              const inspectionVerified =
                currentStatus ===
                "VERIFIED_BY_CVO";

              const inspectionRejected =
                currentStatus ===
                "REJECTED_BY_CVO";

              const inspectionCompleted =
                inspectionVerified ||
                inspectionRejected;

              const applicationApproved =
                currentStatus ===
                  "APPLICATION_APPROVED" ||
                currentStatus ===
                  "APPROVED";

              const applicationRejected =
                currentStatus ===
                  "APPLICATION_REJECTED" ||
                currentStatus ===
                  "REJECTED";

              const currentlyForwarding =
                forwardingId ===
                applicationId;

              const canAdminForward =
                isAdmin &&
                showForwardAction &&
                isSubmitted(row) &&
                !forwarded &&
                !isInspectionScheduled &&
                !inspectionCompleted &&
                !applicationApproved &&
                !applicationRejected;

              const canCvoSchedule =
                isCvo &&
                showScheduleInspectionAction &&
                forwarded &&
                !isInspectionScheduled &&
                !inspectionCompleted;

              const canCvoUploadReport =
                isCvo &&
                isInspectionScheduled &&
                !inspectionCompleted;

              return (
                <TableRow
                  key={
                    applicationId ||
                    index
                  }
                >
                  {/* DATA COLUMNS */}

                  {getArray(
                    props.tableColumns
                  ).map(
                    (
                      column,
                      columnIndex
                    ) => {
                      let cellValue;

                      if (
                        typeof column.render ===
                        "function"
                      ) {
                        cellValue =
                          column.render(
                            row
                          );
                      } else {
                        cellValue =
                          row?.[
                            column.attr
                          ];
                      }

                      if (
                        column.attr ===
                        "status"
                      ) {
                        cellValue =
                          getStatusLabel(
                            currentStatus
                          );
                      }

                      return (
                        <TableCell
                          key={
                            column?.attr ||
                            columnIndex
                          }
                        >
                          {displayValue(
                            cellValue
                          )}
                        </TableCell>
                      );
                    }
                  )}

                  {/* PREVIEW */}

                  <TableCell>
                    {normalizeStatus(
                      row?.entityType
                    ) ===
                    "DOG_BREEDER" ? (
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
                    {normalizeStatus(
                      row?.entityType
                    ) ===
                    "DOG_BREEDER" ? (
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

                  {/* ACTION */}

                  {showActionColumn && (
                    <TableCell>
                      {/* ADMIN ACTION */}

                      {isAdmin &&
                        showForwardAction && (
                          <>
                            {applicationApproved ? (
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    setReportApplicationId(getApplicationId(row))
                                  }
                                >
                                  VIEW REPORT
                                </Button>
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
                              </Box>
                            ) : applicationRejected ? (
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    setReportApplicationId(getApplicationId(row))
                                  }
                                >
                                  VIEW REPORT
                                </Button>
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
                              </Box>
                            ) : inspectionRejected ? (
                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    setReportApplicationId(getApplicationId(row))
                                  }
                                >
                                  VIEW REPORT
                                </Button>
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
                              </Box>
                            ) : inspectionVerified ? (
                              <Box
                                sx={{
                                  display:
                                    "flex",
                                  gap: 1,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    setReportApplicationId(getApplicationId(row))
                                  }
                                >
                                  VIEW REPORT
                                </Button>
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
                                INSPECTION SCHEDULED
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
                            ) : canAdminForward ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                disabled={
                                  currentlyForwarding ||
                                  isSubmitting
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
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                disabled
                              >
                                {getStatusLabel(
                                  currentStatus
                                )}
                              </Button>
                            )}
                          </>
                        )}

                      {/* CVO ACTION */}

                      {isCvo &&
                        showScheduleInspectionAction && (
                          <>
                            {inspectionRejected ? (
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
                            ) : inspectionVerified ? (
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
                                VERIFIED BY CVO
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
                                INSPECTION SCHEDULED
                              </Button>
                            ) : canCvoSchedule ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="info"
                                startIcon={
                                  <EventIcon />
                                }
                                onClick={() =>
                                  handleOpenScheduleModal(
                                    row
                                  )
                                }
                              >
                                Schedule Inspection
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                disabled
                              >
                                {getStatusLabel(
                                  currentStatus
                                )}
                              </Button>
                            )}
                          </>
                        )}
                    </TableCell>
                  )}

                  {/* CVO DECISION */}

                  {showDecisionColumn && (
                    <TableCell>
                      {inspectionVerified ? (
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          disabled
                          sx={{
                            "&.Mui-disabled":
                              {
                                color:
                                  "#ffffff",
                                backgroundColor:
                                  "#2e7d32",
                                opacity: 0.8,
                              },
                          }}
                        >
                          VERIFIED BY CVO
                        </Button>
                      ) : inspectionRejected ? (
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          disabled
                          sx={{
                            "&.Mui-disabled":
                              {
                                color:
                                  "#ffffff",
                                backgroundColor:
                                  "#d32f2f",
                                opacity: 0.8,
                              },
                          }}
                        >
                          REJECTED BY CVO
                        </Button>
                      ) : canCvoUploadReport ? (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleUploadReportClick(
                              row
                            )
                          }
                        >
                          Upload Reports
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          disabled
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

          {/* EMPTY */}

          {visibleRows.length ===
            0 && (
            <TableRow>
              <TableCell
                colSpan={
                  (props.tableColumns
                    ?.length || 0) +
                  2 +
                  (showActionColumn
                    ? 1
                    : 0) +
                  (showDecisionColumn
                    ? 1
                    : 0)
                }
                align="center"
              >
                No dog breeder registration
                applications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* =========================================================
          SCHEDULE INSPECTION DIALOG
         ========================================================= */}

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

        <DialogContent
          dividers
        >
          <Box
            sx={{
              display: "flex",
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
              InputLabelProps={{
                shrink: true,
              }}
              value={
                inspectionDate
              }
              onChange={(e) =>
                setInspectionDate(
                  e.target.value
                )
              }
            />

            <TextField
              label="Remarks"
              multiline
              rows={3}
              fullWidth
              value={
                inspectionRemarks
              }
              onChange={(e) =>
                setInspectionRemarks(
                  e.target.value
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
              isScheduling
            }
          >
            {isScheduling
              ? "Saving..."
              : "Save Schedule"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =========================================================
          UPLOAD REPORT DIALOG
         ========================================================= */}

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

        <DialogContent
          dividers
        >
          <Box
            sx={{
              display: "flex",
              flexDirection:
                "column",
              gap: 2,
              pt: 1,
            }}
          >
            <Button
              variant="outlined"
              component="label"
            >
              Select Inspection Report File

              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setInspectionReport(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />
            </Button>

            {inspectionReport && (
              <Typography
                variant="caption"
              >
                Selected file:{" "}
                {displayValue(
                  inspectionReport.name
                )}
              </Typography>
            )}

            {!inspectionReport &&
              existingReport && (
                <Typography
                  variant="caption"
                  color="success.main"
                >
                  Existing inspection
                  report is available.
                </Typography>
              )}

            <TextField
              label="Inspection Remarks"
              multiline
              rows={3}
              fullWidth
              value={remarks}
              onChange={(e) =>
                setRemarks(
                  e.target.value
                )
              }
            />

            <TextField
              label="Recommendation Details"
              multiline
              rows={3}
              fullWidth
              required
              value={
                recommendation
              }
              onChange={(e) =>
                setRecommendation(
                  e.target.value
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
              isSubmitting
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
              isSubmitting
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

      {/* =========================================================
          PREVIEW DIALOG
         ========================================================= */}

      <Dialog
        open={previewOpen}
        onClose={
          handleClosePreview
        }
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Dog Breeder Application
          Details -{" "}
          {displayValue(
            registration?.applicationNumber
          )}
        </DialogTitle>

        <DialogContent
          dividers
        >
          {previewLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Step6Preview
              breederDetails={breeder}
              facilityDetails={facility}
              breedDetails={breeds}
              declarationDetails={declaration}
              documents={documents}
            />
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
      <InspectionReportDialog
        applicationId={reportApplicationId}
        onClose={() => setReportApplicationId(null)}
      />
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

  refreshList:
    PropTypes.func,

  handleRefresh:
    PropTypes.func,
};

export default List;
