import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getHeader } from "../../utils";

import {
  getApplicationDocumentsByApplicationId,
} from "../../api-client/applicationDocument";

import {
  DOG_BREEDER_APPLICATION_PREVIEW_URL,
  DOG_BREEDER_DOCUMENT_VIEW_URL,
  DOG_BREEDER_DETAIL_LIST_URL,
  DOG_BREEDER_FACILITY_API_URL,
  DOG_BREEDER_BREED_LIST_URL,
  DOG_BREEDER_DECLARATION_API_URL,
} from "../../config/endpoints";

const BASE_API_URL =
  import.meta.env.VITE_APP_BASE_API_URL || "";

/* =========================================================
   DOCUMENT MASTER LIST
========================================================= */

export const dogBreederDocumentList = [
  {
    id: 22,
    name: "Identity Proof",
    mandatory: true,
  },
  {
    id: 23,
    name: "Address Proof",
    mandatory: true,
  },
  {
    id: 24,
    name: "Establishment Photograph",
    mandatory: true,
  },
  {
    id: 25,
    name: "Infrastructure Photograph",
    mandatory: true,
  },
  {
    id: 26,
    name: "Affidavit",
    mandatory: true,
  },
  {
    id: 21,
    name: "Applicant Signature",
    mandatory: true,
  },
];

/* =========================================================
   COMMON HELPERS
========================================================= */

const buildApiUrl = (
  baseUrl,
  endpoint,
  id = ""
) => {
  const base = String(baseUrl || "")
    .replace(/\/+$/, "");

  const path = String(endpoint || "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const value = String(id ?? "")
    .replace(/^\/+/, "");

  if (!base || !path) {
    return null;
  }

  return value
    ? `${base}/${path}/${value}`
    : `${base}/${path}`;
};

const getResponsePayload = (response) =>
  response?.data?.payLoad ??
  response?.data?.payload ??
  response?.data?.data ??
  response?.data ??
  response?.payLoad ??
  response?.payload ??
  response;

const hasValue = (value) => {
  if (
    value === undefined ||
    value === null
  ) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim() !== "";
  }

  return true;
};

const comparableId = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "";
  }

  return String(value);
};

const normalizeKey = (key) =>
  String(key || "")
    .replace(/[_\-\s]/g, "")
    .toLowerCase();

/* =========================================================
   DISPLAY VALUE HELPER
   IMPORTANT:
   Prevents [object Object]
========================================================= */

const getDisplayValue = (
  value,
  defaultValue = "-"
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
  }

  /*
   * Primitive values
   */
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  /*
   * Arrays
   */
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return defaultValue;
    }

    const values = value
      .map((item) =>
        getDisplayValue(item, "")
      )
      .filter(Boolean);

    return values.length > 0
      ? values.join(", ")
      : defaultValue;
  }

  /*
   * Objects
   */
  if (
    typeof value === "object"
  ) {
    /*
     * Most common DTO fields.
     */
    const possibleKeys = [
      "name",
      "label",
      "displayName",
      "description",
      "statusName",
      "districtName",
      "applicationStatusName",
      "value",
      "title",
      "code",
      "text",
    ];

    for (const key of possibleKeys) {
      if (hasValue(value?.[key])) {
        return getDisplayValue(
          value[key],
          defaultValue
        );
      }
    }

    /*
     * Nested status object.
     */
    if (hasValue(value?.status)) {
      return getDisplayValue(
        value.status,
        defaultValue
      );
    }

    /*
     * Nested district object.
     */
    if (hasValue(value?.district)) {
      return getDisplayValue(
        value.district,
        defaultValue
      );
    }

    /*
     * Nested data.
     */
    if (hasValue(value?.data)) {
      return getDisplayValue(
        value.data,
        defaultValue
      );
    }

    /*
     * Nested payload.
     */
    if (hasValue(value?.payload)) {
      return getDisplayValue(
        value.payload,
        defaultValue
      );
    }

    /*
     * Nested payLoad.
     */
    if (hasValue(value?.payLoad)) {
      return getDisplayValue(
        value.payLoad,
        defaultValue
      );
    }

    return defaultValue;
  }

  return String(value);
};

/* =========================================================
   VALUE HELPERS
========================================================= */

const getValue = (
  object,
  keys,
  defaultValue = ""
) => {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return defaultValue;
  }

  const wanted =
    keys.map(normalizeKey);

  /*
   * Direct property lookup
   */
  for (const key of keys) {
    if (hasValue(object[key])) {
      return object[key];
    }
  }

  /*
   * Case / underscore / hyphen independent
   * lookup
   */
  for (const [
    actualKey,
    value,
  ] of Object.entries(object)) {
    if (
      wanted.includes(
        normalizeKey(actualKey)
      ) &&
      hasValue(value)
    ) {
      return value;
    }
  }

  return defaultValue;
};

const findNestedValue = (
  object,
  keys,
  visited = new WeakSet()
) => {
  if (
    !object ||
    typeof object !== "object"
  ) {
    return undefined;
  }

  if (visited.has(object)) {
    return undefined;
  }

  visited.add(object);

  const wanted =
    keys.map(normalizeKey);

  /*
   * Direct lookup
   */
  for (const key of keys) {
    if (hasValue(object[key])) {
      return object[key];
    }
  }

  /*
   * Normalized lookup
   */
  for (const [
    actualKey,
    value,
  ] of Object.entries(object)) {
    if (
      wanted.includes(
        normalizeKey(actualKey)
      ) &&
      hasValue(value)
    ) {
      return value;
    }
  }

  /*
   * Recursive lookup
   */
  for (const value of Object.values(
    object
  )) {
    if (
      value &&
      typeof value === "object"
    ) {
      const result =
        findNestedValue(
          value,
          keys,
          visited
        );

      if (hasValue(result)) {
        return result;
      }
    }
  }

  return undefined;
};

const resolveValue = (
  primaryObject,
  completeData,
  keys,
  defaultValue = "-"
) => {
  const direct = getValue(
    primaryObject,
    keys,
    ""
  );

  if (hasValue(direct)) {
    return direct;
  }

  const nested = findNestedValue(
    completeData,
    keys
  );

  return hasValue(nested)
    ? nested
    : defaultValue;
};

/* =========================================================
   OBJECT HELPERS
========================================================= */

const isPlainObject = (value) =>
  Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value)
  );

const mergeObjects = (...objects) =>
  objects.reduce(
    (result, object) => {
      if (!isPlainObject(object)) {
        return result;
      }

      const validEntries =
        Object.entries(object)
          .filter(([, value]) => {
            if (
              value === undefined ||
              value === null
            ) {
              return false;
            }

            if (
              typeof value === "string"
            ) {
              return (
                value.trim() !== ""
              );
            }

            return true;
          });

      return {
        ...result,
        ...Object.fromEntries(
          validEntries
        ),
      };
    },
    {}
  );

/* =========================================================
   APPLICATION ID
========================================================= */

const extractApplicationId = (
  value,
  fallback
) => {
  const payload =
    getResponsePayload(value) ||
    value ||
    {};

  const id =
    payload?.applicationId ??
    payload?.applicationID ??
    payload?.registrationApplicationId ??
    payload?.registration_application_id ??
    payload?.dogBreederApplicationId ??
    payload?.dogBreederApplication?.id ??
    payload?.registrationDetails
      ?.applicationId ??
    payload?.registrationDetails?.id ??
    payload?.registration?.id ??
    payload?.application?.id ??
    payload?.id ??
    fallback;

  return hasValue(id)
    ? id
    : null;
};

/* =========================================================
   DOG BREEDER DETAIL ID
========================================================= */

const getDogBreederDetailId = (
  value
) => {
  const payload =
    getResponsePayload(value) ||
    value ||
    {};

  return String(
    payload?.dogBreederDetailId ??
      payload?.dog_breeder_detail_id ??
      payload?.dogBreederDetail?.id ??
      payload?.dogBreederDetails?.id ??
      payload?.breederDetails?.id ??
      payload?.breederDetail?.id ??
      payload?.detailId ??
      payload?.detail?.id ??
      payload?.id ??
      ""
  );
};

/* =========================================================
   LIST RESPONSE
========================================================= */

const getListPayload = (
  response
) => {
  const payload =
    getResponsePayload(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    Array.isArray(payload?.content)
  ) {
    return payload.content;
  }

  if (
    Array.isArray(payload?.data)
  ) {
    return payload.data;
  }

  if (
    Array.isArray(payload?.items)
  ) {
    return payload.items;
  }

  if (
    Array.isArray(payload?.results)
  ) {
    return payload.results;
  }

  return payload &&
    typeof payload === "object"
    ? [payload]
    : [];
};

/* =========================================================
   LOAD ALL RECORDS
========================================================= */

const getAllRecords = async (
  endpoint
) => {
  const cleanEndpoint =
    String(endpoint || "")
      .replace(/\/+$/, "");

  const url = buildApiUrl(
    BASE_API_URL,
    `${cleanEndpoint}/list/all`
  );

  if (!url) {
    return [];
  }

  try {
    const response =
      await axios.get(url, {
        headers:
          getHeader() || {},
        params: {
          pageNo: 0,
          pageSize: 1000,
        },
      });

    const records =
      getListPayload(response);

    console.log(
      `Loaded records from ${endpoint}:`,
      records
    );

    return records;
  } catch (error) {
    console.error(
      `Failed to load ${endpoint}:`,
      error?.response?.data ||
        error?.message ||
        error
    );

    return [];
  }
};

/* =========================================================
   STEP 1 DATA DETECTION
========================================================= */

const hasStep1Data = (
  item
) => {
  if (!isPlainObject(item)) {
    return false;
  }

  return [
    "name",
    "breederName",
    "ownerName",
    "applicantName",
    "addressLine1",
    "addressLine2",
    "city",
    "pincode",
    "pinCode",
    "contactMobile",
    "mobile",
    "mobileNumber",
    "contactEmail",
    "email",
    "totalDogsCount",
    "totalDogs",
    "facilityDetails",
  ].some((key) =>
    hasValue(item?.[key])
  );
};

/* =========================================================
   APPLICATION IDS FROM RECORD
========================================================= */

const getApplicationIdsFromObject = (
  item
) => {
  if (
    !item ||
    typeof item !== "object"
  ) {
    return [];
  }

  return [
    item?.applicationId,
    item?.applicationID,
    item?.application_id,

    item?.registrationApplicationId,
    item?.registration_application_id,

    item?.registrationId,
    item?.registration_id,

    item?.application?.id,
    item?.application?.applicationId,

    item?.registrationApplication?.id,
    item?.registrationApplication
      ?.applicationId,

    item?.registrationDetails?.id,
    item?.registrationDetails
      ?.applicationId,

    item?.dogBreederApplication?.id,
    item?.dogBreederApplication
      ?.applicationId,
  ]
    .filter(hasValue)
    .map(comparableId);
};

/* =========================================================
   DETAIL IDS FROM RECORD
========================================================= */

const getDetailIdsFromObject = (
  item
) => {
  if (
    !item ||
    typeof item !== "object"
  ) {
    return [];
  }

  return [
    item?.dogBreederDetailId,
    item?.dog_breeder_detail_id,

    item?.breederDetailId,
    item?.detailId,

    item?.dogBreederDetail?.id,
    item?.dogBreederDetails?.id,

    item?.breederDetail?.id,
    item?.breederDetails?.id,

    item?.detail?.id,

    item?.id,
  ]
    .filter(hasValue)
    .map(comparableId);
};

/* =========================================================
   MATCH RECORDS
========================================================= */

const getMatchingRecords = (
  records,
  applicationId,
  detailId,
  rowData
) => {
  if (!Array.isArray(records)) {
    return [];
  }

  const targetApplicationId =
    comparableId(applicationId);

  const targetDetailId =
    comparableId(detailId);

  const rowName = String(
    rowData?.breederName ||
      rowData?.name ||
      rowData?.breeder ||
      rowData?.ownerName ||
      rowData?.applicantName ||
      ""
  )
    .trim()
    .toLowerCase();

  const byDetail = [];
  const byApplication = [];
  const byName = [];
  const withStep1Data = [];

  records.forEach((item) => {
    if (
      !item ||
      typeof item !== "object"
    ) {
      return;
    }

    const applicationIds =
      getApplicationIdsFromObject(
        item
      );

    const detailIds =
      getDetailIdsFromObject(item);

    const itemName = String(
      item?.name ||
        item?.breederName ||
        item?.ownerName ||
        item?.applicantName ||
        ""
    )
      .trim()
      .toLowerCase();

    /*
     * Highest priority:
     * detail ID
     */
    if (
      targetDetailId &&
      detailIds.includes(
        targetDetailId
      )
    ) {
      byDetail.push(item);
      return;
    }

    /*
     * Second priority:
     * application ID
     */
    if (
      targetApplicationId &&
      applicationIds.includes(
        targetApplicationId
      )
    ) {
      byApplication.push(item);
      return;
    }

    /*
     * Third priority:
     * applicant/breeder name
     */
    if (
      rowName &&
      itemName &&
      rowName === itemName &&
      hasStep1Data(item)
    ) {
      byName.push(item);
      return;
    }

    /*
     * Last fallback
     */
    if (hasStep1Data(item)) {
      withStep1Data.push(item);
    }
  });

  return [
    ...byDetail,
    ...byApplication,
    ...byName,
    ...withStep1Data,
  ];
};

/* =========================================================
   GET STEP 1 DETAIL
========================================================= */

const getStep1Detail = (
  records,
  applicationId,
  existingDetail,
  rowData
) => {
  const detailId =
    getDogBreederDetailId(
      existingDetail
    );

  const matches =
    getMatchingRecords(
      records,
      applicationId,
      detailId,
      rowData
    );

  console.log(
    "STEP 1 MATCHED RECORDS:",
    matches
  );

  return (
    matches.find(
      hasStep1Data
    ) ||
    matches[0] ||
    (hasStep1Data(
      existingDetail
    )
      ? existingDetail
      : {})
  );
};

/* =========================================================
   MERGE APPLICATION DATA
========================================================= */

const mergeApplicationData = (
  fallbackData,
  previewData
) => ({
  ...mergeObjects(
    fallbackData,
    previewData
  ),

  registrationDetails:
    mergeObjects(
      fallbackData?.registrationDetails,
      previewData?.registrationDetails
    ),

  dogBreederDetail:
    mergeObjects(
      fallbackData?.dogBreederDetail,
      fallbackData?.dogBreederDetails,
      fallbackData?.breederDetails,
      fallbackData?.breederDetail,

      previewData?.dogBreederDetail,
      previewData?.dogBreederDetails,
      previewData?.breederDetails,
      previewData?.breederDetail
    ),

  breederDetails:
    mergeObjects(
      fallbackData?.breederDetails,
      fallbackData?.dogBreederDetail,
      fallbackData?.breederDetail,

      previewData?.breederDetails,
      previewData?.dogBreederDetail,
      previewData?.breederDetail
    ),

  dogBreederFacility:
    mergeObjects(
      fallbackData?.dogBreederFacility,
      fallbackData?.facilityDetails,
      fallbackData?.facility,

      previewData?.dogBreederFacility,
      previewData?.facilityDetails,
      previewData?.facility
    ),

  facilityDetails:
    mergeObjects(
      fallbackData?.facilityDetails,
      fallbackData?.dogBreederFacility,
      previewData?.facilityDetails,
      previewData?.dogBreederFacility
    ),

  dogBreederDeclaration:
    mergeObjects(
      fallbackData?.dogBreederDeclaration,
      fallbackData?.declarationDetails,

      previewData?.dogBreederDeclaration,
      previewData?.declarationDetails
    ),

  declarationDetails:
    mergeObjects(
      fallbackData?.declarationDetails,
      fallbackData?.dogBreederDeclaration,

      previewData?.declarationDetails,
      previewData?.dogBreederDeclaration
    ),
});

/* =========================================================
   HYDRATE APPLICATION
========================================================= */

const hydrateApplicationDetails =
  async (
    applicationData,
    fallbackId,
    rowData = {}
  ) => {
    const applicationId =
      extractApplicationId(
        applicationData,
        fallbackId
      );

    const existingDetail =
      mergeObjects(
        applicationData?.dogBreederDetail,
        applicationData?.dogBreederDetails,
        applicationData?.breederDetails,
        applicationData?.breederDetail,
        applicationData?.breeder,
        applicationData?.dogBreeder
      );

    let detailId =
      getDogBreederDetailId(
        existingDetail
      );

    console.log(
      "APPLICATION ID:",
      applicationId
    );

    console.log(
      "EXISTING DOG BREEDER DETAIL:",
      existingDetail
    );

    console.log(
      "EXISTING DETAIL ID:",
      detailId
    );

    const detailRecords =
      await getAllRecords(
        DOG_BREEDER_DETAIL_LIST_URL
      );

    console.log(
      "DOG BREEDER DETAIL RECORDS:",
      detailRecords
    );

    const detail =
      getStep1Detail(
        detailRecords,
        applicationId,
        existingDetail,
        rowData
      );

    console.log(
      "SELECTED STEP 1 DETAIL:",
      detail
    );

    detailId =
      getDogBreederDetailId(detail) ||
      detailId;

    const finalDetail =
      mergeObjects(
        existingDetail,
        detail
      );

    console.log(
      "FINAL STEP 1 DETAIL:",
      finalDetail
    );

    const [
      facilityRecords,
      breedRecords,
      declarationRecords,
    ] = await Promise.all([
      getAllRecords(
        DOG_BREEDER_FACILITY_API_URL
      ),

      getAllRecords(
        DOG_BREEDER_BREED_LIST_URL
      ),

      getAllRecords(
        DOG_BREEDER_DECLARATION_API_URL
      ),
    ]);

    const facilityMatches =
      getMatchingRecords(
        facilityRecords,
        applicationId,
        detailId,
        rowData
      );

    const breedMatches =
      getMatchingRecords(
        breedRecords,
        applicationId,
        detailId,
        rowData
      );

    const declarationMatches =
      getMatchingRecords(
        declarationRecords,
        applicationId,
        detailId,
        rowData
      );

    const facility =
      facilityMatches[0] ||
      mergeObjects(
        applicationData?.dogBreederFacility,
        applicationData?.facilityDetails,
        applicationData?.facility,
        applicationData?.facilityDetail
      );

    const existingBreeds =
      Array.isArray(
        applicationData?.dogBreederBreeds
      )
        ? applicationData.dogBreederBreeds
        : Array.isArray(
            applicationData?.breedDetails
          )
        ? applicationData.breedDetails
        : Array.isArray(
            applicationData?.breeds
          )
        ? applicationData.breeds
        : [];

    const breeds =
      breedMatches.length > 0
        ? breedMatches
        : existingBreeds;

    const declaration =
      declarationMatches[0] ||
      mergeObjects(
        applicationData?.dogBreederDeclaration,
        applicationData?.declarationDetails,
        applicationData?.declaration
      );

    return {
      ...applicationData,

      applicationId:
        applicationId ??
        applicationData?.applicationId,

      dogBreederDetail:
        finalDetail,

      dogBreederDetails:
        finalDetail,

      breederDetails:
        finalDetail,

      breederDetail:
        finalDetail,

      breeder:
        finalDetail,

      dogBreeder:
        finalDetail,

      dogBreederFacility:
        mergeObjects(
          applicationData?.dogBreederFacility,
          applicationData?.facilityDetails,
          facility
        ),

      facilityDetails:
        mergeObjects(
          applicationData?.facilityDetails,
          applicationData?.dogBreederFacility,
          facility
        ),

      dogBreederBreeds:
        breeds,

      breedDetails:
        breeds,

      breeds,

      dogBreederDeclaration:
        mergeObjects(
          applicationData?.dogBreederDeclaration,
          declaration
        ),

      declarationDetails:
        mergeObjects(
          applicationData?.declarationDetails,
          declaration
        ),
    };
  };

/* =========================================================
   DOCUMENT HELPERS
========================================================= */

const isDocumentLike = (
  value
) =>
  Boolean(
    value &&
      typeof value === "object" &&
      (
        value.id ||
        value.documentId ||
        value.applicationDocumentId ||
        value.documentTypeId ||
        value.applicationDocumentTypeId ||
        value.documentType ||
        value.fileName ||
        value.filename ||
        value.originalFileName ||
        value.storedFileName ||
        value.filePath ||
        value.fileUrl ||
        value.url ||
        value.base64
      )
  );

const normalizeDocumentCollection = (
  value,
  visited = new WeakSet()
) => {
  const payload =
    getResponsePayload(value);

  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload.filter(Boolean);
  }

  if (
    typeof payload !== "object"
  ) {
    return [];
  }

  if (visited.has(payload)) {
    return [];
  }

  visited.add(payload);

  if (isDocumentLike(payload)) {
    return [payload];
  }

  const nestedKeys = [
    "documentDetails",
    "documents",
    "applicationDocuments",
    "applicationDocumentList",
    "supportingDocuments",
    "documentList",
    "uploadedDocuments",
    "uploadedDocumentList",
    "attachments",
    "attachmentList",
    "files",
    "docList",
    "content",
    "data",
    "payLoad",
    "payload",
  ];

  for (const key of nestedKeys) {
    const result =
      normalizeDocumentCollection(
        payload[key],
        visited
      );

    if (result.length) {
      return result;
    }
  }

  const result = [];

  for (const [
    key,
    item,
  ] of Object.entries(payload)) {
    if (
      !item ||
      typeof item !== "object"
    ) {
      continue;
    }

    if (
      /^\d+$/.test(key) ||
      isDocumentLike(item)
    ) {
      result.push({
        ...item,

        documentTypeId:
          item?.documentTypeId ??
          item?.document_type_id ??
          item?.applicationDocumentTypeId ??
          item?.application_document_type_id ??
          item?.documentType?.id ??
          item?.documentTypeDto?.id ??
          item?.typeId ??
          key,
      });
    }
  }

  return result;
};

const getDocumentTypeId = (
  doc
) =>
  doc?.documentTypeId ??
  doc?.document_type_id ??
  doc?.applicationDocumentTypeId ??
  doc?.application_document_type_id ??
  doc?.applicationDocumentType?.id ??
  doc?.application_document_type?.id ??
  doc?.masterDocumentId ??
  doc?.master_document_id ??
  doc?.documentType?.id ??
  doc?.documentTypeDto?.id ??
  doc?.documentTypeDTO?.id ??
  doc?.typeId ??
  doc?.type?.id;

const getDocumentTypeName = (
  doc
) =>
  getDisplayValue(
    doc?.documentTypeName ||
      doc?.document_type_name ||
      doc?.applicationDocumentTypeName ||
      doc?.application_document_type_name ||
      doc?.applicationDocumentType ||
      doc?.application_document_type ||
      doc?.masterDocumentName ||
      doc?.master_document_name ||
      doc?.documentName ||
      doc?.documentType ||
      doc?.documentTypeDto ||
      doc?.documentTypeDTO ||
      doc?.typeName ||
      doc?.type ||
      "",
    ""
  );

const getDocumentId = (
  doc
) =>
  doc?.id ||
  doc?.documentId ||
  doc?.applicationDocumentId ||
  doc?.application_document_id ||
  doc?.application_document?.id ||
  doc?.applicationDocument?.id ||
  doc?.payLoad?.id ||
  doc?.payload?.id ||
  doc?.fileId ||
  doc?.attachmentId;

const getDocumentFileName = (
  doc
) =>
  getDisplayValue(
    doc?.fileName ||
      doc?.filename ||
      doc?.originalFileName ||
      doc?.original_file_name ||
      doc?.storedFileName ||
      doc?.stored_file_name ||
      doc?.docName ||
      doc?.documentName ||
      doc?.name ||
      "",
    ""
  );

/* =========================================================
   FIELD COMPONENT
========================================================= */

const Field = ({
  label,
  value,
  fullWidth = false,
}) => (
  <Box
    sx={{
      gridColumn: fullWidth
        ? "1 / -1"
        : "auto",
      mb: 1.5,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        fontWeight: 700,
        color: "#222",
        mb: 0.3,
      }}
    >
      {label}
    </Typography>

    <Typography
      variant="body2"
      sx={{
        color: "#444",
        minHeight: 20,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {getDisplayValue(value)}
    </Typography>
  </Box>
);

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  fullWidth: PropTypes.bool,
};

/* =========================================================
   SECTION COMPONENT
========================================================= */

const Section = ({
  number,
  title,
  children,
}) => (
  <Box
    sx={{
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      p: 2.2,
      mb: 2.5,
      backgroundColor: "#fff",
      color: "#000",
    }}
  >
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 700,
        mb: 2,
        color: "#1976d2",
      }}
    >
      Section {number} — {title}
    </Typography>

    {children}
  </Box>
);

Section.propTypes = {
  number: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/* =========================================================
   DOCUMENT CARD
========================================================= */

const DocumentCard = ({
  masterDoc,
  document: doc,
  onView,
  onDownload,
}) => {
  const docId =
    getDocumentId(doc);

  const documentName =
    getDocumentTypeName(doc) ||
    masterDoc?.name ||
    "";

  const fileName =
    getDocumentFileName(doc);

  const previewUrl =
    doc?.fileUrl ||
    doc?.filePath ||
    doc?.url ||
    (doc?.base64
      ? String(
          doc.base64
        ).startsWith("data:")
        ? doc.base64
        : `data:image/jpeg;base64,${doc.base64}`
      : null);

  if (!documentName) {
    return null;
  }

  return (
    <Card
      variant="outlined"
      sx={{
        border: "1px solid #000",
        borderRadius: "4px",
        height: "100%",
        boxShadow: "none",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          height: 140,
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom:
            "1px solid #e0e0e0",
          overflow: "hidden",
          p: 1,
        }}
      >
        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt={documentName}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            {fileName ||
              "No Preview Available"}
          </Typography>
        )}
      </Box>

      <CardContent
        sx={{
          p: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent:
            "space-between",
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "#222",
              fontSize: 13,
              mb: 0.5,
            }}
          >
            {documentName}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#666",
              fontSize: 11,
              display: "block",
              mb: 1.5,
              wordBreak: "break-all",
            }}
          >
            {fileName ||
              "File not provided"}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          className="no-print"
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={
              <VisibilityIcon fontSize="small" />
            }
            onClick={() =>
              onView(docId)
            }
            disabled={!docId}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              fontSize: 10,
              fontWeight: 700,
              px: 1,
              py: 0.4,
              borderRadius: 3,
            }}
          >
            VIEW
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={
              <DownloadIcon fontSize="small" />
            }
            onClick={() =>
              onDownload(
                docId,
                fileName
              )
            }
            disabled={!docId}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              fontSize: 10,
              fontWeight: 700,
              px: 1,
              py: 0.4,
              borderRadius: 3,
            }}
          >
            DOWNLOAD
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

DocumentCard.propTypes = {
  masterDoc: PropTypes.object,
  document: PropTypes.object,
  onView: PropTypes.func.isRequired,
  onDownload:
    PropTypes.func.isRequired,
};

/* =========================================================
   MAIN FORM
========================================================= */

const Form = ({
  rowID,
  rowData,
  onClose,
}) => {
  const [data, setData] =
    useState(rowData || null);

  const [
    loadedDocuments,
    setLoadedDocuments,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState(null);

  /* =======================================================
     LOAD APPLICATION
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadDocuments =
      async (applicationId) => {
        if (!applicationId) {
          return [];
        }

        try {
          const response =
            await getApplicationDocumentsByApplicationId(
              applicationId
            );

          const documents =
            normalizeDocumentCollection(
              response
            );

          console.log(
            "DOG BREEDER DOCUMENTS:",
            documents
          );

          return documents;
        } catch (error) {
          console.error(
            "Supporting documents load failed:",
            error
          );

          return [];
        }
      };

    const loadApplication =
      async () => {
        try {
          setLoading(true);
          setErrorMsg(null);
          setLoadedDocuments([]);

          const applicationId =
            extractApplicationId(
              rowData,
              rowID
            ) || rowID;

          console.log(
            "FINAL APPLICATION ID:",
            applicationId
          );

          if (!applicationId) {
            if (mounted) {
              setData(
                rowData || null
              );
            }

            return;
          }

          /* ===============================================
             PREVIEW API
          =============================================== */

          let previewData = {};

          try {
            const previewUrl =
              buildApiUrl(
                BASE_API_URL,
                DOG_BREEDER_APPLICATION_PREVIEW_URL,
                applicationId
              );

            if (previewUrl) {
              console.log(
                "DOG BREEDER PREVIEW URL:",
                previewUrl
              );

              const response =
                await axios.get(
                  previewUrl,
                  {
                    headers:
                      getHeader() || {},
                  }
                );

              const payload =
                getResponsePayload(
                  response
                );

              console.log(
                "DOG BREEDER PREVIEW RESPONSE:",
                payload
              );

              if (
                payload &&
                typeof payload ===
                  "object"
              ) {
                previewData =
                  Array.isArray(payload)
                    ? payload[0] || {}
                    : payload;
              }
            }
          } catch (previewError) {
            console.warn(
              "Preview endpoint failed. Continuing with DogBreederDetail API.",
              previewError?.response
                ?.data ||
                previewError?.message
            );
          }

          /* ===============================================
             MERGE ROW + PREVIEW
          =============================================== */

          const merged =
            mergeApplicationData(
              rowData || {},
              previewData
            );

          /* ===============================================
             LOAD STEP 1
          =============================================== */

          const hydrated =
            await hydrateApplicationDetails(
              merged,
              applicationId,
              rowData || {}
            );

          console.log(
            "DOG BREEDER HYDRATED DATA:",
            hydrated
          );

          /* ===============================================
             LOAD DOCUMENTS
          =============================================== */

          const documents =
            await loadDocuments(
              applicationId
            );

          if (mounted) {
            setData(hydrated);

            setLoadedDocuments(
              documents
            );

            setErrorMsg(null);
          }
        } catch (error) {
          console.error(
            "Dog breeder application load failed:",
            error
          );

          const applicationId =
            extractApplicationId(
              rowData,
              rowID
            ) || rowID;

          let documents = [];

          try {
            documents =
              await loadDocuments(
                applicationId
              );
          } catch {
            documents = [];
          }

          if (mounted) {
            setData(
              rowData || null
            );

            setLoadedDocuments(
              documents
            );

            setErrorMsg(null);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadApplication();

    return () => {
      mounted = false;
    };
  }, [rowID, rowData]);

  /* =======================================================
     BACK
  ======================================================= */

  const handleBackAction = () => {
    if (
      typeof onClose ===
      "function"
    ) {
      onClose();
    } else {
      window.history.back();
    }
  };

  /* =======================================================
     DOCUMENT BLOB
  ======================================================= */

  const getDocumentBlob =
    async (docId) => {
      const url = buildApiUrl(
        BASE_API_URL,
        DOG_BREEDER_DOCUMENT_VIEW_URL,
        docId
      );

      if (!url) {
        throw new Error(
          "Invalid document URL."
        );
      }

      return axios.get(url, {
        headers:
          getHeader() || {},
        responseType: "blob",
      });
    };

  /* =======================================================
     VIEW DOCUMENT
  ======================================================= */

  const handleViewDocument =
    async (docId) => {
      if (!docId) {
        return;
      }

      try {
        const response =
          await getDocumentBlob(
            docId
          );

        const contentType =
          response?.headers?.[
            "content-type"
          ] ||
          "application/pdf";

        const blob = new Blob(
          [response.data],
          {
            type: contentType,
          }
        );

        const blobUrl =
          window.URL.createObjectURL(
            blob
          );

        window.open(
          blobUrl,
          "_blank",
          "noopener,noreferrer"
        );

        setTimeout(() => {
          window.URL.revokeObjectURL(
            blobUrl
          );
        }, 60000);
      } catch (error) {
        console.error(
          "Document preview failed:",
          error
        );

        alert(
          "Unable to view document."
        );
      }
    };

  /* =======================================================
     DOWNLOAD DOCUMENT
  ======================================================= */

  const handleDownloadDocument =
    async (
      docId,
      fileName
    ) => {
      if (!docId) {
        return;
      }

      try {
        const response =
          await getDocumentBlob(
            docId
          );

        const blob = new Blob(
          [response.data],
          {
            type:
              response?.headers?.[
                "content-type"
              ] ||
              "application/octet-stream",
          }
        );

        const blobUrl =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = blobUrl;

        link.download =
          fileName || "document";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          blobUrl
        );
      } catch (error) {
        console.error(
          "Document download failed:",
          error
        );

        alert(
          "Unable to download document."
        );
      }
    };

  /* =======================================================
     RESOLVE DISPLAY DATA
  ======================================================= */

  const resolved = useMemo(() => {
    if (!data) {
      return {};
    }

    const reg =
      mergeObjects(
        data?.registrationDetails,
        data?.registration,
        data?.registrationDetail
      );

    const breeder =
      mergeObjects(
        data?.dogBreederDetail,
        data?.dogBreederDetails,
        data?.breederDetails,
        data?.breederDetail,
        data?.breeder,
        data?.dogBreeder,

        data?.ownerDetails,
        data?.owner,

        data?.applicantDetails,
        data?.applicant
      );

    const facility =
      mergeObjects(
        data?.dogBreederFacility,
        data?.facilityDetails,
        data?.facilityDetail,
        data?.facility,
        data?.infrastructureDetails,
        data?.infrastructure
      );

    const declaration =
      mergeObjects(
        data?.dogBreederDeclaration,
        data?.declarationDetails,
        data?.declaration
      );

    const affidavit =
      mergeObjects(
        data?.affidavitDetails,
        data?.affidavit
      );

    const breeds =
      Array.isArray(
        data?.dogBreederBreeds
      )
        ? data.dogBreederBreeds
        : Array.isArray(
            data?.breedDetails
          )
        ? data.breedDetails
        : Array.isArray(
            data?.breeds
          )
        ? data.breeds
        : Array.isArray(
            data?.dogBreedDetails
          )
        ? data.dogBreedDetails
        : Array.isArray(
            data?.dogBreedDetail
          )
        ? data.dogBreedDetail
        : [];

    /* =====================================================
       NESTED ADDRESS
    ===================================================== */

    const nestedAddress =
      breeder?.address &&
      typeof breeder.address ===
        "object"
        ? breeder.address
        : {};

    /* =====================================================
       NAME
    ===================================================== */

    const name =
      resolveValue(
        breeder,
        data,
        [
          "breederName",
          "name",
          "ownerName",
          "applicantName",
          "dogBreederName",
          "fullName",
          "full_name",
          "breeder_name",
          "owner_name",
          "applicant_name",
        ]
      );

    /* =====================================================
       ADDRESS LINE 1
    ===================================================== */

    const addressLine1 =
      getValue(
        nestedAddress,
        [
          "addressLine1",
          "address1",
          "line1",
          "address",
          "address_line_1",
          "address_1",
        ]
      ) ||
      resolveValue(
        breeder,
        data,
        [
          "addressLine1",
          "address1",
          "address",
          "addressLine",
          "address_line_1",
          "address_1",
          "presentAddress",
          "residentialAddress",
          "houseName",
          "houseNumber",
          "houseNameNumber",
        ]
      );

    /* =====================================================
       ADDRESS LINE 2
    ===================================================== */

    const addressLine2 =
      getValue(
        nestedAddress,
        [
          "addressLine2",
          "address2",
          "line2",
          "address_line_2",
          "address_2",
          "landmark",
        ]
      ) ||
      resolveValue(
        breeder,
        data,
        [
          "addressLine2",
          "address2",
          "address_line_2",
          "address_2",
          "landmark",
          "addressLineTwo",
        ]
      );

    /* =====================================================
       CITY
    ===================================================== */

    const city =
      getValue(
        nestedAddress,
        [
          "city",
          "town",
          "place",
          "locality",
          "addressCity",
        ]
      ) ||
      resolveValue(
        breeder,
        data,
        [
          "city",
          "town",
          "place",
          "locality",
          "addressCity",
          "districtName",
        ]
      );

    /* =====================================================
       PINCODE
    ===================================================== */

    const pincode =
      getValue(
        nestedAddress,
        [
          "pincode",
          "pinCode",
          "postalCode",
          "zipCode",
          "zip",
        ]
      ) ||
      resolveValue(
        breeder,
        data,
        [
          "pincode",
          "pinCode",
          "pin",
          "postalCode",
          "postal_code",
          "zipCode",
          "zip",
        ]
      );

    /* =====================================================
       MOBILE
    ===================================================== */

    const mobile =
      resolveValue(
        breeder,
        data,
        [
          "contactMobile",
          "mobile",
          "mobileNumber",
          "mobileNo",
          "phone",
          "phoneNumber",
          "telephone",
          "telephoneNumber",
          "contactNumber",
          "contactNo",
          "contact_mobile",
          "mobile_number",
        ]
      );

    /* =====================================================
       EMAIL
    ===================================================== */

    const email =
      resolveValue(
        breeder,
        data,
        [
          "contactEmail",
          "email",
          "emailAddress",
          "mail",
          "contact_email",
        ]
      );

    /* =====================================================
       TOTAL DOGS
    ===================================================== */

    const directTotal =
      resolveValue(
        breeder,
        data,
        [
          "totalDogsCount",
          "totalDogs",
          "numberOfDogs",
          "noOfDogs",
          "dogCount",
          "dogsCount",
          "total_dogs_count",
          "total_dogs",
          "number_of_dogs",
        ],
        ""
      );

    const calculatedTotal =
      breeds.reduce(
        (total, item) => {
          const value =
            Number(
              item?.dogCount ??
                item?.quantity ??
                item?.numberOfDogs ??
                item?.count ??
                0
            );

          return (
            total +
            (Number.isNaN(value)
              ? 0
              : value)
          );
        },
        0
      );

    const totalDogs =
      directTotal !== ""
        ? getDisplayValue(
            directTotal
          )
        : calculatedTotal > 0
        ? String(calculatedTotal)
        : "-";

    /* =====================================================
       FACILITY DETAILS
    ===================================================== */

    const directFacility =
      resolveValue(
        breeder,
        data,
        [
          "facilityDetails",
          "facilityDescription",
          "facility_details",
        ],
        ""
      );

    const facilityText =
      directFacility !== ""
        ? getDisplayValue(
            directFacility
          )
        : getDisplayValue(
            resolveValue(
              facility,
              data,
              [
                "facilityDetails",
                "details",
                "description",
                "facilityDescription",
                "facility_details",
              ]
            )
          );

    /* =====================================================
       FACILITY SECTION
    ===================================================== */

    const accommodation =
      resolveValue(
        facility,
        data,
        [
          "accommodationInfrastructure",
          "accommodationAndInfrastructure",
          "accommodationDetails",
          "infrastructureDetails",
          "detailsOfAccommodationAndInfrastructure",
        ]
      );

    const workingHours =
      resolveValue(
        facility,
        data,
        [
          "workingHours",
          "workingHour",
          "working_hours",
          "businessHours",
        ]
      );

    const ventilation =
      resolveValue(
        facility,
        data,
        [
          "ventilationArrangement",
          "ventilation",
          "ventilationDetails",
        ]
      );

    const lighting =
      resolveValue(
        facility,
        data,
        [
          "lightingArrangement",
          "lighting",
          "lightingDetails",
        ]
      );

    const smoke =
      resolveValue(
        facility,
        data,
        [
          "smokeDetectionFireFightingArrangement",
          "smokeDetectionAndFireFighting",
          "smokeDetection",
          "fireFightingArrangement",
          "fireFighting",
          "smokeDetectionFireFighting",
        ]
      );

    const heating =
      resolveValue(
        facility,
        data,
        [
          "heatingCoolingArrangement",
          "heatingArrangement",
          "coolingArrangement",
          "heatingCooling",
        ]
      );

    const power =
      resolveValue(
        facility,
        data,
        [
          "powerBackupArrangement",
          "powerBackup",
          "powerBackupDetails",
        ]
      );

    const food =
      resolveValue(
        facility,
        data,
        [
          "foodStorageArrangement",
          "foodStorage",
          "foodStorageDetails",
        ]
      );

    const cleanliness =
      resolveValue(
        facility,
        data,
        [
          "cleanlinessWasteRemoval",
          "cleanliness",
          "wasteRemoval",
          "cleanlinessAndWasteRemoval",
        ]
      );

    const deadAnimal =
      resolveValue(
        facility,
        data,
        [
          "deadAnimalDisposalArrangement",
          "deadAnimalDisposal",
          "animalDisposal",
        ]
      );

    const veterinary =
      resolveValue(
        facility,
        data,
        [
          "veterinarySupportArrangement",
          "veterinarySupport",
          "veterinaryDetails",
        ]
      );

    const cage =
      resolveValue(
        facility,
        data,
        [
          "cageEnclosureDetails",
          "cageDetails",
          "enclosureDetails",
          "cageEnclosure",
        ]
      );

    /* =====================================================
       APPLICATION HEADER
    ===================================================== */

    const applicationNumber =
      getDisplayValue(
        resolveValue(
          reg,
          data,
          [
            "applicationNumber",
            "applicationNo",
            "application_number",
            "registrationNumber",
          ]
        )
      );

    /*
     * IMPORTANT:
     * status can be String OR Object.
     */
    const rawStatus =
      resolveValue(
        reg,
        data,
        [
          "statusName",
          "status",
          "applicationStatus",
          "applicationStatusName",
        ],
        ""
      );

    /*
     * IMPORTANT:
     * district can be String OR Object.
     */
    const rawDistrict =
      resolveValue(
        reg,
        data,
        [
          "districtName",
          "district",
          "district_name",
        ],
        ""
      );

    const status =
      getDisplayValue(
        rawStatus
      );

    const district =
      getDisplayValue(
        rawDistrict
      );

    const applicationType =
      getDisplayValue(
        resolveValue(
          reg,
          data,
          [
            "applicationKind",
            "applicationType",
            "application_type",
            "type",
          ],
          "Dog Breeder Registration"
        ),
        "Dog Breeder Registration"
      );

    return {
      reg,
      breeder,
      facility,
      declaration,
      affidavit,
      breeds,

      name:
        getDisplayValue(name),

      addressLine1:
        getDisplayValue(
          addressLine1
        ),

      addressLine2:
        getDisplayValue(
          addressLine2
        ),

      city:
        getDisplayValue(city),

      pincode:
        getDisplayValue(
          pincode
        ),

      mobile:
        getDisplayValue(mobile),

      email:
        getDisplayValue(email),

      totalDogs,

      facilityText,
      accommodation,
      workingHours,
      ventilation,
      lighting,
      smoke,
      heating,
      power,
      food,
      cleanliness,
      deadAnimal,
      veterinary,
      cage,

      applicationNumber,
      status,
      district,
      applicationType,
    };
  }, [data]);

  /* =======================================================
     DOCUMENTS
  ======================================================= */

  const rawDocuments = [
    ...normalizeDocumentCollection(
      data
    ),

    ...normalizeDocumentCollection(
      data?.registrationDetails
    ),

    ...normalizeDocumentCollection(
      data?.documents
    ),

    ...loadedDocuments,
  ];

  const uploadedDocumentList =
    useMemo(() => {
      const map = new Map();

      rawDocuments.forEach(
        (doc, index) => {
          if (
            !doc ||
            typeof doc !== "object"
          ) {
            return;
          }

          const id =
            getDocumentId(doc);

          const typeId =
            getDocumentTypeId(doc);

          const name =
            getDocumentTypeName(doc);

          if (
            !id &&
            !typeId &&
            !name
          ) {
            return;
          }

          const key = String(
            id ||
              typeId ||
              `${name}-${index}`
          );

          map.set(key, doc);
        }
      );

      return Array.from(
        map.values()
      );
    }, [
      data,
      loadedDocuments,
    ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",

        "@media print": {
          "& .no-print": {
            display:
              "none !important",
          },
        },
      }}
    >
      <DialogContent
        dividers
        sx={{
          overflowY: "auto",
          p: {
            xs: 2,
            sm: 3,
          },
          backgroundColor: "#fff",
        }}
      >
        {loading ? (
          <Box
            sx={{
              minHeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : errorMsg ? (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
            >
              Unable to Load
              Application Details
            </Typography>

            <Typography variant="body2">
              {errorMsg}
            </Typography>
          </Alert>
        ) : !data ? (
          <Typography
            p={2}
            color="#000"
          >
            No application details
            found.
          </Typography>
        ) : (
          <Box
            id="printable-application-preview"
            sx={{
              maxWidth: 900,
              margin: "0 auto",
              backgroundColor:
                "#fff",
            }}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <Box
              sx={{
                border:
                  "1px solid #e0e0e0",
                borderRadius: 1,
                p: 2.5,
                mb: 2.5,
              }}
            >
              <Typography
                align="center"
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  mb: 0.5,
                  color: "#000",
                }}
              >
                KERALA STATE ANIMAL
                WELFARE BOARD
              </Typography>

              <Typography
                align="center"
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  mb: 2,
                  color: "#555",
                }}
              >
                FORM-1 — Dog Breeder
                Registration
                Application
              </Typography>

              <Divider
                sx={{ mb: 2 }}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  columnGap: 4,
                }}
              >
                <Field
                  label="Application Number"
                  value={
                    resolved.applicationNumber
                  }
                />

                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "#222",
                      mb: 0.3,
                    }}
                  >
                    Status
                  </Typography>

                  <Chip
                    label={
                      getDisplayValue(
                        resolved.status
                      )
                    }
                    size="small"
                    color="primary"
                    sx={{
                      borderRadius: 1,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Field
                  label="Application Type"
                  value={
                    resolved.applicationType
                  }
                />

                <Field
                  label="District"
                  value={
                    resolved.district
                  }
                />
              </Box>
            </Box>

            {/* =================================================
                SECTION 1
            ================================================= */}

            <Section
              number="1"
              title="Dog Breeder & Owner Details"
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  columnGap: 4,
                }}
              >
                <Field
                  label="1. Name and address of the dog breeder:"
                  value={
                    resolved.name
                  }
                  fullWidth
                />

                <Field
                  label="Address Line 1:"
                  value={
                    resolved.addressLine1
                  }
                />

                <Field
                  label="Address Line 2:"
                  value={
                    resolved.addressLine2
                  }
                />

                <Field
                  label="City:"
                  value={
                    resolved.city
                  }
                />

                <Field
                  label="Pincode:"
                  value={
                    resolved.pincode
                  }
                />

                <Field
                  label="Telephone / Mobile:"
                  value={
                    resolved.mobile
                  }
                />

                <Field
                  label="Email:"
                  value={
                    resolved.email
                  }
                />

                <Field
                  label="Total Number of Dogs:"
                  value={
                    resolved.totalDogs
                  }
                />

                <Field
                  label="Facility Details:"
                  value={
                    resolved.facilityText
                  }
                  fullWidth
                />
              </Box>
            </Section>

            {/* =================================================
                SECTION 2
            ================================================= */}

            <Section
              number="2"
              title="Facility & Infrastructure"
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  columnGap: 4,
                }}
              >
                <Field
                  label="2. Details of accommodation and infrastructure:"
                  value={
                    resolved.accommodation
                  }
                  fullWidth
                />

                <Field
                  label="3. Working hours and rest day:"
                  value={
                    resolved.workingHours
                  }
                />

                <Field
                  label="4. Ventilation arrangement:"
                  value={
                    resolved.ventilation
                  }
                />

                <Field
                  label="5. Lighting arrangement:"
                  value={
                    resolved.lighting
                  }
                />

                <Field
                  label="6. Smoke-detection & fire fighting:"
                  value={
                    resolved.smoke
                  }
                />

                <Field
                  label="7. Heating or cooling arrangement:"
                  value={
                    resolved.heating
                  }
                />

                <Field
                  label="8. Power back-up arrangement:"
                  value={
                    resolved.power
                  }
                />

                <Field
                  label="9. Food storage arrangement:"
                  value={
                    resolved.food
                  }
                />

                <Field
                  label="10. Cleanliness & waste removal:"
                  value={
                    resolved.cleanliness
                  }
                />

                <Field
                  label="11. Dead animal disposal:"
                  value={
                    resolved.deadAnimal
                  }
                />

                <Field
                  label="12. Veterinary support:"
                  value={
                    resolved.veterinary
                  }
                />

                <Field
                  label="13. Cage / Enclosure details:"
                  value={
                    resolved.cage
                  }
                  fullWidth
                />
              </Box>
            </Section>

            {/* =================================================
                SECTION 3
            ================================================= */}

            <Section
              number="3"
              title="Dog Breed Details"
            >
              <TableContainer
                component={Paper}
                variant="outlined"
              >
                <Table
                  size="small"
                  sx={{
                    "& th, & td": {
                      border:
                        "1px solid #e0e0e0",
                      fontSize: 12,
                      color: "#000",
                    },

                    "& th": {
                      backgroundColor:
                        "#f5f5f5",
                      fontWeight: 700,
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        Sl No
                      </TableCell>

                      <TableCell>
                        Breed
                      </TableCell>

                      <TableCell>
                        Quantity
                      </TableCell>

                      <TableCell>
                        Age
                      </TableCell>

                      <TableCell>
                        Sex
                      </TableCell>

                      <TableCell>
                        Description
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {resolved.breeds
                      .length > 0 ? (
                      resolved.breeds.map(
                        (
                          item,
                          index
                        ) => (
                          <TableRow
                            key={
                              item?.id ||
                              `${getDisplayValue(
                                item?.breedName ||
                                  item?.breed ||
                                  item?.name,
                                "breed"
                              )}-${index}`
                            }
                          >
                            <TableCell align="center">
                              {index + 1}
                            </TableCell>

                            <TableCell>
                              {getDisplayValue(
                                resolveValue(
                                  item,
                                  item,
                                  [
                                    "breedName",
                                    "breed",
                                    "name",
                                  ]
                                )
                              )}
                            </TableCell>

                            <TableCell>
                              {getDisplayValue(
                                resolveValue(
                                  item,
                                  item,
                                  [
                                    "dogCount",
                                    "quantity",
                                    "numberOfDogs",
                                    "count",
                                  ]
                                )
                              )}
                            </TableCell>

                            <TableCell>
                              {getDisplayValue(
                                resolveValue(
                                  item,
                                  item,
                                  [
                                    "ageDescription",
                                    "age",
                                    "ageDetails",
                                  ]
                                )
                              )}
                            </TableCell>

                            <TableCell>
                              {getDisplayValue(
                                resolveValue(
                                  item,
                                  item,
                                  [
                                    "gender",
                                    "sex",
                                  ]
                                )
                              )}
                            </TableCell>

                            <TableCell>
                              {getDisplayValue(
                                resolveValue(
                                  item,
                                  item,
                                  [
                                    "description",
                                    "remarks",
                                  ]
                                )
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          sx={{
                            py: 3,
                            color: "#777",
                          }}
                        >
                          No dog breed
                          details added
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Section>

            {/* =================================================
                SECTION 4
            ================================================= */}

            <Section
              number="4"
              title="Declaration"
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  lineHeight: 1.8,
                  color: "#333",
                }}
              >
                I/We do hereby
                declare that
                information provided
                herein is accurate
                and true.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  mb: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="#000"
                >
                  {resolved.declaration
                    ?.isTrue ===
                    true ||
                  resolved.declaration
                    ?.accepted ===
                    true ||
                  resolved.declaration
                    ?.declarationAccepted ===
                    true
                    ? "☑ True"
                    : "☐ True"}
                </Typography>

                <Typography
                  variant="body2"
                  color="#000"
                >
                  {resolved.declaration
                    ?.isTrue ===
                  false
                    ? "☑ False"
                    : "☐ False"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr 1fr",
                  },
                  columnGap: 3,
                }}
              >
                <Field
                  label="Place"
                  value={
                    resolved.declaration
                      ?.place ||
                    resolved.city ||
                    data?.place
                  }
                />

                <Field
                  label="Date"
                  value={
                    resolved.declaration
                      ?.date ||
                    data?.applicationDate ||
                    data?.createdDate ||
                    data?.submittedDate
                  }
                />

                <Field
                  label="Signature of Applicant"
                  value={
                    resolved.declaration
                      ?.signature ||
                    resolved.declaration
                      ?.applicantSignature ||
                    resolved.name
                  }
                />
              </Box>
            </Section>

            {/* =================================================
                SECTION 5
            ================================================= */}

            <Section
              number="5"
              title="Affidavit"
            >
              <Box
                sx={{
                  lineHeight: 2,
                  fontSize: 13,
                  color: "#333",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ mb: 1.5 }}
                >
                  I{" "}
                  <strong>
                    {getDisplayValue(
                      resolved.affidavit
                        ?.applicantName ||
                        resolved.name
                    )}
                  </strong>
                  , S/o., W/o.{" "}
                  <strong>
                    {getDisplayValue(
                      resolved.affidavit
                        ?.parentName ||
                        resolved.affidavit
                          ?.guardianName ||
                        resolveValue(
                          resolved.breeder,
                          data,
                          [
                            "fatherName",
                            "parentName",
                            "guardianName",
                          ]
                        )
                    )}
                  </strong>
                  , aged{" "}
                  <strong>
                    {getDisplayValue(
                      resolved.affidavit
                        ?.age ||
                        resolveValue(
                          resolved.breeder,
                          data,
                          ["age"]
                        )
                    )}
                  </strong>
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 1.5 }}
                >
                  residing at{" "}
                  <strong>
                    {getDisplayValue(
                      resolved.affidavit
                        ?.address ||
                        resolved.addressLine1 ||
                        (typeof resolved
                          .breeder
                          ?.address ===
                        "string"
                          ? resolved
                              .breeder
                              .address
                          : "-")
                    )}
                  </strong>
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 1.5 }}
                >
                  do hereby solemnly
                  affirm and state as
                  follows:
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 0.8 }}
                >
                  1. I do hereby follow
                  the applicable
                  Prevention of Cruelty
                  to Animals and Dog
                  Breeding Rules.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 0.8 }}
                >
                  2. I do hereby abide
                  by all the rules laid
                  down by the Animal
                  Welfare Board of
                  India.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 0.8 }}
                >
                  3. I do hereby
                  undertake to fulfil
                  all conditions in Dog
                  Breeder Registration
                  Rules.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 0.8 }}
                >
                  4. I accept
                  cancellation of
                  registration in case
                  of misconduct.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 3 }}
                >
                  5. This affidavit is
                  true and correct to
                  the best of my
                  knowledge.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    mt: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="#666"
                  >
                    Solemnly affirmed
                    and signed
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#666"
                  >
                    Deponent
                  </Typography>
                </Box>
              </Box>
            </Section>

            {/* =================================================
                SUPPORTING DOCUMENTS
            ================================================= */}

            <Box
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#000",
                  mb: 2,
                }}
              >
                Supporting Documents
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2,
                }}
              >
                {uploadedDocumentList
                  .length > 0 ? (
                  uploadedDocumentList.map(
                    (
                      doc,
                      index
                    ) => (
                      <DocumentCard
                        key={
                          getDocumentId(
                            doc
                          ) ||
                          `${getDocumentTypeName(
                            doc
                          )}-${index}`
                        }
                        document={doc}
                        masterDoc={dogBreederDocumentList.find(
                          (
                            master
                          ) =>
                            String(
                              master.id
                            ) ===
                            String(
                              getDocumentTypeId(
                                doc
                              )
                            )
                        )}
                        onView={
                          handleViewDocument
                        }
                        onDownload={
                          handleDownloadDocument
                        }
                      />
                    )
                  )
                ) : (
                  <Card
                    variant="outlined"
                    sx={{
                      border:
                        "1px solid #000",
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <CardContent>
                      <Typography>
                        No supporting
                        documents
                        uploaded.
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <DialogActions
        className="no-print"
        sx={{
          p: 2,
          borderTop:
            "1px solid #e0e0e0",
          backgroundColor: "#fff",
          justifyContent:
            "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          startIcon={
            <ArrowBackIcon />
          }
          onClick={
            handleBackAction
          }
          sx={{
            borderRadius: 1,
            color: "#666",
            borderColor: "#ccc",
            fontWeight: 600,
            textTransform:
              "uppercase",
            px: 2.5,
          }}
        >
          BACK
        </Button>

        <Button
          variant="contained"
          startIcon={
            <DownloadIcon />
          }
          onClick={() =>
            window.print()
          }
          disabled={
            !data || loading
          }
          sx={{
            borderRadius: 1,
            backgroundColor:
              "#1976d2",
            fontWeight: 600,
            textTransform:
              "uppercase",
            px: 2.5,
          }}
        >
          DOWNLOAD PDF
        </Button>
      </DialogActions>
    </Box>
  );
};

/* =========================================================
   PROP TYPES
========================================================= */

Form.propTypes = {
  rowID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  rowData: PropTypes.object,
  onClose: PropTypes.func,
};

export default Form;