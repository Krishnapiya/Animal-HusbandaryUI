import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PropTypes from "prop-types";

const getFormattedValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => getFormattedValue(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    if ("name" in value && value.name !== undefined) {
      return String(value.name);
    }

    if ("label" in value && value.label !== undefined) {
      return String(value.label);
    }

    return JSON.stringify(value);
  }

  return String(value);
};

const getValue = (value) => {
  const formatted = getFormattedValue(value);
  return formatted || "__________________________";
};

const isImageFile = (fileName) =>
  /\.(jpe?g|png|webp)$/i.test(String(fileName || ""));

const isPdfFile = (fileName) => /\.pdf$/i.test(String(fileName || ""));

const getDocumentName = (document) => {
  if (document?.file instanceof File) {
    return document.file.name;
  }
  if (document?.fileName) {
    return document.fileName;
  }
  if (document?.filename) {
    return document.filename;
  }
  if (document?.filePath) {
    return document.filePath.split("/").pop();
  }
  return "Identity Proof";
};

const getDocumentViewUrl = (document) => {
  if (document?.file instanceof File) {
    return URL.createObjectURL(document.file);
  }

  if (document?.filePath) {
    return `http://localhost:8083/petshop/auth/application-document/view/${document.filePath}`;
  }

  return "";
};

const getDocumentDownloadUrl = (document) => {
  if (document?.file instanceof File) {
    return getDocumentViewUrl(document);
  }

  if (document?.filePath) {
    return `http://localhost:8083/petshop/auth/application-document/view/${document.filePath}`;
  }

  return "";
};

const Step5Preview = ({
  formValues = {},
  facilityForm = {},
  animals = [],
  declaration = {},
  supportingDocuments = [],
}) => {
  const declarationDate = declaration?.declarationDate
    ? new Date(declaration.declarationDate)
    : null;

  const day = declarationDate ? declarationDate.getDate() : "";
  const month = declarationDate
    ? declarationDate.toLocaleString("default", {
        month: "long",
      })
    : "";
  const year = declarationDate ? declarationDate.getFullYear() : "";

  const shopAddress = [
    getFormattedValue(formValues.shopName),
    getFormattedValue(formValues.shopAddressLine1),
    getFormattedValue(formValues.shopAddressLine2),
    getFormattedValue(formValues.shopCity),
    getFormattedValue(formValues.shopPincode),
  ]
    .filter(Boolean)
    .join(", ");

  const ownerAddress = [
    getFormattedValue(formValues.ownerName),
    getFormattedValue(formValues.ownerAddressLine1),
    getFormattedValue(formValues.ownerAddressLine2),
    getFormattedValue(formValues.ownerCity),
    getFormattedValue(formValues.ownerPincode),
  ]
    .filter(Boolean)
    .join(", ");

  const workingHours = `${getFormattedValue(facilityForm.openingTime)} - ${getFormattedValue(
    facilityForm.closingTime
  )}`.trim();

  const restDay =
    Array.isArray(facilityForm.restDay) && facilityForm.restDay.length > 0
      ? facilityForm.restDay
          .map(getFormattedValue)
          .filter(Boolean)
          .join(", ")
      : getFormattedValue(facilityForm.restDay);

  return (
    <Card
      sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        p: 4,
        backgroundColor: "#fff",
        position: "relative",
        boxShadow: 3,
        fontFamily: "Times New Roman",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-30deg)",
          textAlign: "center",
          width: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "64px",
            fontWeight: 700,
            color: "rgba(0,0,0,0.06)",
            whiteSpace: "nowrap",
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          KERALA STATE
        </Typography>

        <Typography
          sx={{
            fontSize: "64px",
            fontWeight: 700,
            color: "rgba(0,0,0,0.06)",
            whiteSpace: "nowrap",
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          ANIMAL WELFARE BOARD
        </Typography>
      </Box>

      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            border: "1px solid #000",
            p: 3,
            mb: 4,
            pageBreakInside: "avoid",
          }}
        >
          <Typography align="center" fontWeight="bold" sx={{ fontSize: 18 }}>
            KERALA STATE ANIMAL WELFARE BOARD
          </Typography>

          <Typography
            align="center"
            fontWeight="bold"
            sx={{ mt: 1, fontSize: 16 }}
          >
            FORM-1
          </Typography>

          <Typography
            align="center"
            fontWeight="bold"
            sx={{ mt: 1, fontSize: 16 }}
          >
            Pet Shop Registration Application
          </Typography>

          <Box
            sx={{
              borderTop: "1px solid #000",
              mt: 3,
              pt: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography fontWeight="bold" variant="body2">
                  Application Number
                </Typography>
                <Typography>
                  {getValue(formValues.applicationNumber)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight="bold" variant="body2">
                  Status
                </Typography>
                <Typography>{getValue(formValues.status)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight="bold" variant="body2">
                  Application Type
                </Typography>
                <Typography>{getValue(formValues.applicationType)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight="bold" variant="body2">
                  District
                </Typography>
                <Typography>{getValue(formValues.district)}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box
          sx={{
            border: "1px solid #000",
            p: 3,
            mb: 4,
            pageBreakInside: "avoid",
          }}
        >
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            SECTION 1 - Pet Shop & Owner Details
          </Typography>

          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  1. Name and address of the pet shop:
                </Typography>
                <Typography>{shopAddress || getValue("")}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  2. Name and address of the pet shop owner:
                </Typography>
                <Typography>{ownerAddress || getValue("")}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  3. Telephone number (landline and mobile):
                </Typography>
                <Typography>
                  {getValue(formValues.contactMobile)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            border: "1px solid #000",
            p: 3,
            mb: 4,
            pageBreakInside: "avoid",
          }}
        >
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            SECTION 2 - Facility & Infrastructure
          </Typography>

          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  4. Details of accommodation and infrastructure available at
                  proposed pet shop:
                </Typography>
                <Typography>
                  {getValue(facilityForm.accommodationInfrastructure)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  5. Working hours and rest day:
                </Typography>
                <Typography>
                  {workingHours || getValue("")}
                  {restDay ? ` | ${restDay}` : ""}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  6. Ventilation arrangement:
                </Typography>
                <Typography>
                  {getValue(facilityForm.ventilationArrangement)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  7. Lighting arrangement:
                </Typography>
                <Typography>
                  {getValue(facilityForm.lightingArrangement)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  8. Smoke-detection and fire fighting arrangement:
                </Typography>
                <Typography>
                  {getValue(facilityForm.fireSafetyArrangement)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  9. Heating or cooling arrangement, and manner in which
                  comfortable temperature will be maintained for all pet
                  animals:
                </Typography>
                <Typography>
                  {getValue(facilityForm.heatingCoolingArrangement)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  10. Power back-up arrangement:
                </Typography>
                <Typography>
                  {getValue(facilityForm.powerBackupArrangement)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  11. Arrangements for food storage:
                </Typography>
                <Typography>
                  {getValue(facilityForm.foodStorageArrangement)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  12. Cleanliness, how proposed to be maintained, and
                  arrangements for removal of animal excreta and waste:
                </Typography>
                <Typography>
                  {getValue(facilityForm.cleanlinessWasteArrangement)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  13. Arrangement for disposal of animals that die:
                </Typography>
                <Typography>
                  {getValue(facilityForm.deadAnimalDisposalArrangement)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  alignItems: "start",
                  gap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  14. Arrangement for medical and veterinary support:
                </Typography>
                <Typography>
                  {getValue(facilityForm.veterinarySupportArrangement)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            border: "1px solid #000",
            p: 3,
            mb: 4,
            pageBreakInside: "avoid",
          }}
        >
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            SECTION 3 - Proposed Animals
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ boxShadow: "none", border: "1px solid #000" }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", borderRight: "1px solid #000" }}
                  >
                    Sl No
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", borderRight: "1px solid #000" }}
                  >
                    Species
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", borderRight: "1px solid #000" }}
                  >
                    Breed
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", borderRight: "1px solid #000" }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", borderRight: "1px solid #000" }}
                  >
                    Age
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", borderRight: "1px solid #000" }}
                  >
                    Price Offered
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {animals.length > 0 ? (
                  animals.map((animal, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ borderRight: "1px solid #000" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #000" }}>
                        {getFormattedValue(animal?.species)}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #000" }}>
                        {getValue(animal?.breed)}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #000" }}>
                        {getValue(animal?.quantity)}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #000" }}>
                        {getValue(animal?.ageDescription)}
                      </TableCell>
                      <TableCell sx={{ borderRight: "1px solid #000" }}>
                        {getValue(animal?.priceOffered)}
                      </TableCell>
                      <TableCell>{getValue(animal?.description)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                      No proposed animals added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          sx={{
            border: "1px solid #000",
            p: 3,
            mb: 4,
            pageBreakInside: "avoid",
          }}
        >
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            SECTION 4 - Declaration
          </Typography>

          <Typography sx={{ mb: 2, whiteSpace: "pre-line" }}>
            I/We do hereby declare that information provided herein is
            accurate and true.
          </Typography>

          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
            <Typography>☑ True</Typography>
            <Typography>☐ False</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography fontWeight="bold">Place</Typography>
              <Box sx={{ borderBottom: "1px solid #000", minHeight: 24 }}>
                <Typography>
                  {getFormattedValue(declaration.declarationPlace)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography fontWeight="bold">Date</Typography>
              <Box sx={{ borderBottom: "1px solid #000", minHeight: 24 }}>
                <Typography>
                  {getFormattedValue(declaration.declarationDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography fontWeight="bold">Signature of Applicant</Typography>
              <Box sx={{ borderBottom: "1px solid #000", minHeight: 40 }} />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            border: "1px solid #000",
            p: 3,
            pageBreakInside: "avoid",
            pageBreakBefore: "always",
          }}
        >
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            SECTION 5 - Affidavit
          </Typography>

          <Typography sx={{ lineHeight: 2, mb: 2 }}>
            I{" "}
            <strong>
              {getFormattedValue(declaration.affidavitDeponentName) ||
                "________________"}
            </strong>
            , S/o., W/o{" "}
            <Box
              component="span"
              sx={{
                borderBottom: "1px solid #000",
                display: "inline-block",
                minWidth: "180px",
              }}
            >
              &nbsp;
            </Box>
            , aged{" "}
            <Box
              component="span"
              sx={{
                borderBottom: "1px solid #000",
                display: "inline-block",
                minWidth: "120px",
              }}
            >
              &nbsp;
            </Box>
          </Typography>

          <Typography sx={{ lineHeight: 2, mb: 3 }}>
            residing at{" "}
            <strong>
              {[
                getFormattedValue(formValues.ownerAddressLine1),
                getFormattedValue(formValues.ownerAddressLine2),
                getFormattedValue(formValues.ownerCity),
                getFormattedValue(formValues.ownerPincode),
              ]
                .filter(Boolean)
                .join(", ")}
            </strong>
          </Typography>

          <Typography sx={{ mb: 2 }}>
            do hereby solemnly affirm and state as follows:
          </Typography>

          <Typography sx={{ mt: 1 }}>
            1. I do hereby follow the Prevention of Cruelty to Animals (Pet Shop)
            Rules, 2018.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            2. I do hereby abide by all the rules laid down by Animal Welfare
            Board of India.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            3. I do hereby undertake to fulfil all conditions in Pet Shop
            Registration Rules.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            4. I accept cancellation of registration in case of misconduct.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            5. This affidavit is true and correct to the best of my knowledge.
          </Typography>

          <Typography sx={{ mt: 4 }}>Solemnly affirmed and signed</Typography>

          <Typography sx={{ mt: 3, textAlign: "right" }}>Deponent</Typography>

          <Box sx={{ mt: 4 }}>
            <Typography
              sx={{
                fontFamily: "Times New Roman",
                fontSize: "16px",
                lineHeight: 2,
              }}
            >
              This day{" "}
              <Box
                component="span"
                sx={{
                  borderBottom: "1px solid #000",
                  padding: "0 15px",
                }}
              >
                {day}
              </Box>{" "}
              of{" "}
              <Box
                component="span"
                sx={{
                  borderBottom: "1px solid #000",
                  padding: "0 20px",
                }}
              >
                {month}
              </Box>{" "}
              20
              <Box
                component="span"
                sx={{
                  borderBottom: "1px solid #000",
                  padding: "0 10px",
                }}
              >
                {String(year).slice(-2)}
              </Box>{" "}
              at{" "}
              <Box
                component="span"
                sx={{
                  borderBottom: "1px solid #000",
                  padding: "0 20px",
                }}
              >
                {getFormattedValue(declaration.declarationPlace)}
              </Box>{" "}
              Before me
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mb: 4,
            pageBreakInside: "avoid",
          }}
        >
          <Typography fontWeight="bold" sx={{ mb: 2 }}>
            SUPPORTING DOCUMENTS
          </Typography>

          <Grid container spacing={2}>
            {supportingDocuments.length > 0 ? (
              supportingDocuments.map((document, index) => {
                const fileName = getDocumentName(document);
                const viewUrl = getDocumentViewUrl(document);
                const downloadUrl = getDocumentDownloadUrl(document);
                const hasFile =
                  (document?.file instanceof File) || Boolean(document?.filePath);

                const imagePreview =
                  document?.file instanceof File &&
                  isImageFile(document.file.name)
                    ? viewUrl
                    : document?.filePath && isImageFile(document.filePath)
                    ? viewUrl
                    : null;

                const isPdf =
                  (document?.file instanceof File &&
                    isPdfFile(document.file.name)) ||
                  (document?.filePath && isPdfFile(document.filePath));

                return (
                  <Grid item xs={12} md={6} key={index}>
                    <Card
                      sx={{
                        height: "100%",
                        border: "1px solid #000",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      {imagePreview ? (
                        <CardMedia
                          component="img"
                          image={imagePreview}
                          alt={fileName}
                          sx={{
                            height: 180,
                            objectFit: "contain",
                            backgroundColor: "#f5f5f5",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 180,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          {isPdf ? (
                            <PictureAsPdfIcon sx={{ fontSize: 48 }} />
                          ) : (
                            <Typography>Not Uploaded</Typography>
                          )}
                        </Box>
                      )}

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography fontWeight="bold" gutterBottom>
                          {document?.documentTypeName ||
 document?.documentType ||
 document?.label ||
 "Identity Proof"}
                        </Typography>
                        <Typography sx={{ mb: 2 }}>
                          {hasFile ? fileName : "Not Uploaded"}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            href={hasFile ? viewUrl : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            disabled={!hasFile}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            href={hasFile ? downloadUrl : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={hasFile}
                            disabled={!hasFile}
                          >
                            Download
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Card sx={{ border: "1px solid #000" }}>
                  <CardContent>
                    <Typography>No supporting documents uploaded.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

Step5Preview.propTypes = {
  formValues: PropTypes.shape({
    applicationNumber: PropTypes.string,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    applicationType: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    district: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    shopName: PropTypes.string,
    shopAddressLine1: PropTypes.string,
    shopAddressLine2: PropTypes.string,
    shopCity: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    shopPincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ownerName: PropTypes.string,
    ownerAddressLine1: PropTypes.string,
    ownerAddressLine2: PropTypes.string,
    ownerCity: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    ownerPincode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contactMobile: PropTypes.string,
  }),
  facilityForm: PropTypes.shape({
    accommodationInfrastructure: PropTypes.string,
    openingTime: PropTypes.string,
    closingTime: PropTypes.string,
    restDay: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    ventilationArrangement: PropTypes.string,
    lightingArrangement: PropTypes.string,
    fireSafetyArrangement: PropTypes.string,
    heatingCoolingArrangement: PropTypes.string,
    powerBackupArrangement: PropTypes.string,
    foodStorageArrangement: PropTypes.string,
    cleanlinessWasteArrangement: PropTypes.string,
    deadAnimalDisposalArrangement: PropTypes.string,
    veterinarySupportArrangement: PropTypes.string,
  }),
  animals: PropTypes.arrayOf(
    PropTypes.shape({
      species: PropTypes.oneOfType([
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string,
        }),
        PropTypes.string,
      ]),
      breed: PropTypes.string,
      quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ageDescription: PropTypes.string,
      priceOffered: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
    })
  ),
  declaration: PropTypes.shape({
    declarationPlace: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    declarationDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
      PropTypes.object,
    ]),
    affidavitDeponentName: PropTypes.string,
  }),
  supportingDocuments: PropTypes.arrayOf(
    PropTypes.shape({
      documentType: PropTypes.string,
      label: PropTypes.string,
      fileName: PropTypes.string,
      filename: PropTypes.string,
      filePath: PropTypes.string,
      file: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.object]),
    })
  ),
};

Step5Preview.defaultProps = {
  formValues: {},
  facilityForm: {},
  animals: [],
  declaration: {},
  supportingDocuments: [],
};

export default Step5Preview;