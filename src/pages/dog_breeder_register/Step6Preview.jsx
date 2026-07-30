import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  
} from "@mui/material";

import { viewApplicationDocument } from "../../api-client/applicationDocument";

const SIGNATURE_DOCUMENT_TYPE_ID = "8"; // Applicant Signature document_type id

const getValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "................................................................................................";
  }

  return value;
};

const getShortValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "....................................";
  }

  return value;
};

const getSavedDocumentId = (file) => {
  return (
    file?.id ||
    file?.documentId ||
    file?.applicationDocumentId ||
    file?.payLoad?.id ||
    file?.payload?.id ||
    ""
  );
};

const normalizeDocuments = (documents) => {
  if (Array.isArray(documents)) {
    return documents;
  }

  return Object.entries(documents || {}).map(([key, value]) => {
    if (value instanceof File) {
      return {
        documentTypeId: key,
        file: value,
        fileName: value.name,
        name: value.name,
        mimeType: value.type,
        fileSizeBytes: value.size,
      };
    }

    return {
      ...(value || {}),
      documentTypeId: value?.documentTypeId || key,
    };
  });
};

const getSignatureDocument = (documents) => {
  const documentList = normalizeDocuments(documents);

  return documentList.find((document) => {
    const documentTypeId = String(
      document?.documentTypeId ||
        document?.document_type_id ||
        document?.documentType?.id ||
        ""
    );

    const documentTypeCode = String(
      document?.documentTypeCode ||
        document?.code ||
        document?.documentType?.code ||
        ""
    ).toUpperCase();

    const documentName = String(
      document?.documentName ||
        document?.documentTypeName ||
        document?.documentType?.name ||
        document?.name ||
        document?.fileName ||
        ""
    ).toLowerCase();

    return (
      documentTypeId === SIGNATURE_DOCUMENT_TYPE_ID ||
      documentTypeCode === "APPLICANT_SIGNATURE" ||
      documentName.includes("signature")
    );
  });
};

const FieldLine = ({ number, label, value }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography sx={{ fontSize: 15, lineHeight: 1.8 }}>
      {number}) {label}:{" "}
      <Box component="span" sx={{ fontWeight: 600 }}>
        {getValue(value)}
      </Box>
    </Typography>
  </Box>
);

const SubFieldLine = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography sx={{ fontSize: 15, lineHeight: 1.8, pl: 3 }}>
      {label}:{" "}
      <Box component="span" sx={{ fontWeight: 600 }}>
        {getValue(value)}
      </Box>
    </Typography>
  </Box>
);

const Step6Preview = ({
  breederDetails = {},
  facilityDetails = {},
  breedDetails = [],
  declarationDetails = {},
  documents = {},
  documentValues = {},
  
}) => {
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState("");

  const previewDocuments =
    documents && Object.keys(documents || {}).length > 0
      ? documents
      : documentValues;

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    const loadSignaturePreview = async () => {
      const signatureDocument = getSignatureDocument(previewDocuments);

      console.log("STEP 6 DOCUMENTS:", previewDocuments);
      console.log("SIGNATURE DOCUMENT:", signatureDocument);

      if (!signatureDocument) {
        setSignaturePreviewUrl("");
        return;
      }

      const selectedFile =
        signatureDocument?.file instanceof File
          ? signatureDocument.file
          : signatureDocument instanceof File
          ? signatureDocument
          : null;

      if (selectedFile) {
        objectUrl = URL.createObjectURL(selectedFile);

        if (!cancelled) {
          setSignaturePreviewUrl(objectUrl);
        }

        return;
      }

      const savedDocumentId = getSavedDocumentId(signatureDocument);

      if (!savedDocumentId) {
        setSignaturePreviewUrl("");
        return;
      }

      try {
        const response = await viewApplicationDocument(savedDocumentId);

        if (!response?.data || response.data.size === 0) {
          setSignaturePreviewUrl("");
          return;
        }

        const contentType =
          response.headers?.["content-type"] ||
          signatureDocument.mimeType ||
          signatureDocument.type ||
          "image/png";

        const blob =
          response.data instanceof Blob
            ? response.data
            : new Blob([response.data], { type: contentType });

        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setSignaturePreviewUrl(objectUrl);
        }
      } catch (error) {
        console.error("SIGNATURE PREVIEW ERROR:", error);

        if (!cancelled) {
          setSignaturePreviewUrl("");
        }
      }
    };

    loadSignaturePreview();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [previewDocuments]);

  const normalizedBreedDetails = Array.isArray(breedDetails)
    ? breedDetails
    : breedDetails?.breedName
    ? [breedDetails]
    : [];

  const applicantAddress = [
    breederDetails.addressLine1,
    breederDetails.addressLine2,
    breederDetails.city,
    breederDetails.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const establishmentAddress =
    breederDetails.establishmentAddress ||
    breederDetails.facilityDetails ||
    applicantAddress;

  const breedNamesAndCounts =
    normalizedBreedDetails.length > 0
      ? normalizedBreedDetails
          .map(
            (item) =>
              `${item.breedName || "-"} - ${item.dogCount || "-"} dog(s)`
          )
          .join(", ")
      : "";

  const dogAges =
    normalizedBreedDetails.length > 0
      ? normalizedBreedDetails
          .map((item) => item.ageDescription || "-")
          .join(", ")
      : "";

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 900,
        mx: "auto",
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 5 },
          fontFamily: "Times New Roman, serif",
          color: "#111827",
        }}
      >
        <Typography
          align="center"
          sx={{ fontWeight: 700, fontSize: 17, textTransform: "uppercase" }}
        >
          Kerala State Animal Welfare Board
        </Typography>

        <Typography
          align="center"
          sx={{ fontWeight: 700, fontSize: 16, mt: 1 }}
        >
          THE FIRST SCHEDULE
        </Typography>

        <Typography align="center" sx={{ fontSize: 14 }}>
          [rules 4(2) and 5(1)]
        </Typography>

        <Typography
          align="center"
          sx={{ fontWeight: 700, fontSize: 16, mt: 1 }}
        >
          FORM - I
        </Typography>

        <Typography
          align="center"
          sx={{
            fontWeight: 700,
            fontSize: 16,
            textTransform: "uppercase",
            mt: 1,
          }}
        >
          Application for Registration of Breeder in Respect of an Establishment
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 15 }}>To,</Typography>

          <Typography sx={{ fontSize: 15, lineHeight: 1.7, ml: 2 }}>
            Member Secretary/Convenor Kerala State Animal Welfare Board,
            Directorate of Animal Husbandry, 6th Floor, Vikas Bhavan,
            Thiruvananthapuram-33
          </Typography>

          <Typography sx={{ fontSize: 15, ml: 2 }}>
            email: sawbkerala@gmail.com
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 15 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>
              Subject:
            </Box>{" "}
            Application for registration of breeder in respect of an
            establishment
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 15, lineHeight: 1.8 }}>
            Sir, I/We{" "}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {getShortValue(breederDetails.breederName)}
            </Box>{" "}
            r/o{" "}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {getShortValue(applicantAddress)}
            </Box>{" "}
            with office address{" "}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {getShortValue(establishmentAddress)}
            </Box>{" "}
            do hereby apply for a registration as breeder in respect of the
            establishment in accordance with the particulars set out below:
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <FieldLine
          number="1"
          label="Name and address of the applicant (breeder)"
          value={`${breederDetails.breederName || ""}, ${applicantAddress || ""}`}
        />

        <FieldLine
          number="2"
          label="Name and address of the establishment"
          value={establishmentAddress}
        />

        <FieldLine
          number="3"
          label="Telephone number"
          value={breederDetails.contactMobile}
        />

        <FieldLine
          number="4"
          label="Details of accommodation and infrastructure available at proposed establishment"
          value={
            facilityDetails.accommodationInfrastructure ||
            breederDetails.facilityDetails
          }
        />

        <FieldLine
          number="5"
          label="Working hours and rest day, i.e. day on which establishment shall remain closed"
          value={`${facilityDetails.workingHours || ""} ${
            facilityDetails.restDay ? `, Rest day: ${facilityDetails.restDay}` : ""
          }`}
        />

        <FieldLine
          number="6"
          label="Ventilation arrangement"
          value={facilityDetails.ventilationArrangement}
        />

        <FieldLine
          number="7"
          label="Lighting arrangement"
          value={facilityDetails.lightingArrangement}
        />

        <FieldLine
          number="8"
          label="Heating or cooling arrangement, and manner in which comfortable temperature will be maintained for all pet animals"
          value={facilityDetails.heatingCoolingArrangement}
        />

        <FieldLine
          number="9"
          label="Arrangements for food storage"
          value={facilityDetails.foodStorageArrangement}
        />

        <FieldLine
          number="10"
          label="Cleanliness, how proposed to be maintained, and arrangements for removal of animal excreta and waste"
          value={facilityDetails.cleanlinessWasteArrangement}
        />

        <FieldLine
          number="11"
          label="Arrangement for disposal of animal that die"
          value={facilityDetails.deadAnimalDisposalArrangement}
        />

        <FieldLine
          number="12"
          label="Arrangement for medical and veterinary support"
          value={facilityDetails.veterinarySupportArrangement}
        />

        <FieldLine
          number="13"
          label="Details of dogs proposed to be bred in the establishment"
          value={breederDetails.totalDogsCount}
        />

        <SubFieldLine
          label="a) Breeds and number of dogs of each breed"
          value={breedNamesAndCounts}
        />

        <SubFieldLine label="b) Age of each of dog" value={dogAges} />

        <SubFieldLine
          label="c) Accommodation and number and size of cages and enclosures"
          value={facilityDetails.cageEnclosureDetails}
        />

        <FieldLine
          number="14"
          label="Qualification and experience of the applicant (breeder) in respect of breeding"
          value={declarationDetails.qualificationExperience}
        />

        <FieldLine
          number="15"
          label="Details of cheque or demand draft number for payment of fee"
          value=""
        />

        <Divider sx={{ my: 3 }} />

        <Typography sx={{ fontSize: 15, lineHeight: 1.8 }}>
          I/We do hereby declare that the information provided by us is accurate
          and true.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            mt: 4,
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: 15 }}>
            Place:{" "}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {getShortValue(declarationDetails.declarationPlace)}
            </Box>
          </Typography>

          <Box sx={{ textAlign: "center", minWidth: 220 }}>
            <Typography sx={{ fontSize: 15 }}>
              Signature of Applicant:
            </Typography>

            {signaturePreviewUrl ? (
              <Box
                component="img"
                src={signaturePreviewUrl}
                alt="Applicant Signature"
                sx={{
                  width: 160,
                  height: 60,
                  objectFit: "contain",
                  mt: 0.5,
                  borderBottom: "1px solid #111827",
                }}
              />
            ) : (
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                {getShortValue(declarationDetails.signatureName)}
              </Typography>
            )}
          </Box>

          <Typography sx={{ fontSize: 15 }}>
            Date:{" "}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {getShortValue(declarationDetails.declarationDate)}
            </Box>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1 }}>
          Bank Details:
        </Typography>

        <Typography sx={{ fontSize: 15, lineHeight: 1.8 }}>
          Name of the Bank: Kerala Gramin Bank
        </Typography>

        <Typography sx={{ fontSize: 15, lineHeight: 1.8 }}>
          Account Number: 40341111002087
        </Typography>

        <Typography sx={{ fontSize: 15, lineHeight: 1.8 }}>
          IFSC Code: KLGB0040341
        </Typography>

      <Typography sx={{ fontSize: 15, lineHeight: 1.8 }}>
  Name of Branch: Main Branch, Trivandrum GPO (PO),
  Thiruvananthapuram Dist, 695001
</Typography>

        
      </CardContent>
    </Card>
    
  );
};

FieldLine.propTypes = {
  number: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

SubFieldLine.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

Step6Preview.propTypes = {
  breederDetails: PropTypes.object,
  facilityDetails: PropTypes.object,
  breedDetails: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  declarationDetails: PropTypes.object,
  documents: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  documentValues: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

Step6Preview.defaultProps = {
  breederDetails: {},
  facilityDetails: {},
  breedDetails: [],
  declarationDetails: {},
  documents: {},
  documentValues: {},
};

export default Step6Preview;