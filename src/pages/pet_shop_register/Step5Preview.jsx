/* eslint-disable react/prop-types */

import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const getValue = (value) =>
  value || "................................................";

const fillLine = (value, width = "500px") => (
  <Box
    sx={{
      width,
      borderBottom: "1px dotted #000",
      minHeight: "24px",
      ml: 2,
      pl: 1,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
    }}
  >
    {value || ""}
  </Box>
);

const Step5Preview = ({
  formValues = {},
  facilityForm = {},
  animals = [],
  declaration = {},
}) => {
  const declarationDate = declaration?.declarationDate
  ? new Date(declaration.declarationDate)
  : null;

const day = declarationDate
  ? declarationDate.getDate()
  : "";

const month = declarationDate
  ? declarationDate.toLocaleString("default", {
      month: "long",
    })
  : "";

const year = declarationDate
  ? declarationDate.getFullYear()
  : "";
  return (
    <Card
  sx={{
    width: "210mm",
    minHeight: "297mm",
    mx: "auto",
    p: 6,
    backgroundColor: "#fff",
    position: "relative",
    boxShadow: 3,
    fontFamily: "Times New Roman",
    overflow: "hidden",
  }}
>
      {/* WATERMARK */}
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
      fontSize: "60px",
      fontWeight: 700,
      color: "rgba(0,0,0,0.04)",
      whiteSpace: "nowrap",
      letterSpacing: 2,
      lineHeight: 1,
    }}
  >
    KERALA STATE
  </Typography>

  <Typography
    sx={{
      fontSize: "60px",
      fontWeight: 700,
      color: "rgba(0,0,0,0.04)",
      whiteSpace: "nowrap",
      letterSpacing: 2,
      lineHeight: 1,
    }}
  >
    ANIMAL WELFARE BOARD
  </Typography>
</Box>

      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}

        <Typography align="center" fontWeight="bold">
          KERALA STATE ANIMAL WELFARE BOARD
        </Typography>

        <Typography
          align="center"
          fontWeight="bold"
          sx={{ mt: 2 }}
        >
          THE FIRST SCHEDULE
        </Typography>

        <Typography
          align="center"
          fontWeight="bold"
          sx={{ mt: 1 }}
        >
          FORM-1
        </Typography>

        <Typography
          align="center"
          fontWeight="bold"
          sx={{ mt: 4 }}
        >
          APPLICATION FORM FOR REGISTRATION/RENEWAL
        </Typography>

        <Box sx={{ mt: 5 }}>
          <Typography>To</Typography>

          <Typography sx={{ ml: 4 }}>
            Member Secretary/Convenor Kerala
            State Animal Welfare Board
          </Typography>

          <Typography sx={{ ml: 4 }}>
            O/o Director, Animal Husbandry
            Department Vikas Bhavan,
            6th Floor,
            Thiruvananthapuram-33
          </Typography>
        </Box>

        <Typography
          sx={{
            mt: 4,
            fontWeight: "bold",
          }}
        >
          Subject: Application for grant of
          license for Pet Shop
        </Typography>

        <Typography sx={{ mt: 4 }}>
          Sir,
        </Typography>

        <Typography sx={{ mt: 2 }}>
          I/We{" "}
          <strong>
            {getValue(formValues.ownerName)}
          </strong>{" "}
          residing at{" "}
          <strong>
            {getValue(
              formValues.ownerAddressLine1
            )}
          </strong>{" "}
          do hereby apply for registration
          to operate / continue operating a
          pet shop, particulars of which are
          set out below:
        </Typography>

        <Typography sx={{ mt: 4 }}>
  1. Name and address of the pet shop:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    `${formValues.shopName || ""}, ${formValues.shopAddressLine1 || ""}, ${
      formValues.shopAddressLine2 || ""
    }, ${formValues.shopCity || ""}, ${
      formValues.shopPincode || ""
    }`,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  2. Name and address of the pet shop owner:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    `${formValues.ownerName || ""}, ${
      formValues.ownerAddressLine1 || ""
    }, ${formValues.ownerAddressLine2 || ""}, ${
      formValues.ownerCity || ""
    }, ${formValues.ownerPincode || ""}`,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  3. Telephone number (landline and mobile):
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(formValues.contactMobile, "300px")}
</Typography>

<Typography sx={{ mt: 3 }}>
  4. Details of accommodation and infrastructure available at proposed pet shop:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.accommodationInfrastructure,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  5. Working hours and rest day:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    `${facilityForm.openingTime || ""} - ${
      facilityForm.closingTime || ""
    } | ${
      Array.isArray(facilityForm.restDay)
        ? facilityForm.restDay.join(", ")
        : facilityForm.restDay || ""
    }`,
    "500px"
  )}
</Typography>

       

        <Typography sx={{ mt: 3 }}>
  6. Ventilation arrangement:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.ventilationArrangement,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  7. Lighting arrangement:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.lightingArrangement,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  8. Smoke-detection and fire fighting arrangement:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.fireSafetyArrangement,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  9. Heating or cooling arrangement, and manner in which comfortable temperature will be maintained for all pet animals:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.heatingCoolingArrangement,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  10. Power back-up arrangement:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.powerBackupArrangement,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  11. Arrangements for food storage:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.foodStorageArrangement,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  12. Cleanliness, how proposed to be maintained, and arrangements for removal of animal excreta and waste:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.cleanlinessWasteArrangement,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  13. Arrangement for disposal of animals that die:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.deadAnimalDisposalArrangement,
    "650px"
  )}
</Typography>

<Typography sx={{ mt: 3 }}>
  14. Arrangement for medical and veterinary support:
</Typography>

<Typography sx={{ ml: 4 }}>
  {fillLine(
    facilityForm.veterinarySupportArrangement,
    "650px"
  )}
</Typography>


        {/* QUESTION 15 */}

        <Typography
          sx={{
            mt: 4,
            fontWeight: "bold",
          }}
        >
          15. Details of pet animals
          proposed to be displayed:
        </Typography>

        {animals.map((animal, index) => (
  <Typography
    key={index}
    sx={{ ml: 4, mt: 1 }}
  >
    {fillLine(
      `Species : ${animal?.species?.name || ""} | Breed : ${
        animal?.breed || ""
      } | Qty : ${animal?.quantity || ""} | Age : ${
        animal?.ageDescription || ""
      }`,
      "650px"
    )}
  </Typography>
))}

        {/* DECLARATION */}

        <Box sx={{ mt: 6 }}>
          <Typography>
            I/We do hereby declare that
            information provided herein is
            accurate and true.
          </Typography>

          <Typography sx={{ mt: 3 }}>
  Place : {fillLine(declaration.declarationPlace, "250px")}
</Typography>

<Typography sx={{ mt: 2 }}>
  Date : {fillLine(declaration.declarationDate, "250px")}
</Typography>

          <Typography
            sx={{
              mt: 3,
              textAlign: "right",
            }}
          >
            Signature of Applicant
          </Typography>
        </Box>

        {/* AFFIDAVIT */}

        <Box
          sx={{
            mt: 10,
            pageBreakBefore: "always",
          }}
        >
          <Typography
            align="center"
            fontWeight="bold"
          >
            AFFIDAVIT
          </Typography>

          <Typography sx={{ mt: 3, lineHeight: 2 }}>
  I{" "}
  <strong>
    {declaration.affidavitDeponentName || "................"}
  </strong>
  , S/o., W/o{" "}
  <span
    style={{
      borderBottom: "1px dotted #000",
      display: "inline-block",
      minWidth: "180px",
    }}
  >
    &nbsp;
  </span>
  , aged{" "}
  <span
    style={{
      borderBottom: "1px dotted #000",
      display: "inline-block",
      minWidth: "120px",
    }}
  >
    &nbsp;
  </span>
</Typography>

<Typography sx={{ lineHeight: 2 }}>
  residing at{" "}
  <strong>
    {`${formValues.ownerAddressLine1 || ""},
    ${formValues.ownerAddressLine2 || ""},
    ${formValues.ownerCity || ""},
    ${formValues.ownerPincode || ""}`}
  </strong>
</Typography>

<Typography sx={{ mb: 3 }}>
  do hereby solemnly affirm and state as follows:
</Typography>

          <Typography sx={{ mt: 3 }}>
            1. I do hereby follow the
            Prevention of Cruelty to
            Animals (Pet Shop) Rules,
            2018.
          </Typography>

          <Typography sx={{ mt: 2 }}>
            2. I do hereby abide by all
            the rules laid down by Animal
            Welfare Board of India.
          </Typography>

          <Typography sx={{ mt: 2 }}>
            3. I do hereby undertake to
            fulfil all conditions in Pet
            Shop Registration Rules.
          </Typography>

          <Typography sx={{ mt: 2 }}>
            4. I accept cancellation of
            registration in case of
            misconduct.
          </Typography>

          <Typography sx={{ mt: 2 }}>
            5. This affidavit is true and
            correct to the best of my
            knowledge.
          </Typography>

          <Typography sx={{ mt: 5 }}>
            Solemnly affirmed and signed
          </Typography>

          <Typography
            sx={{
              textAlign: "right",
              mt: 4,
            }}
          >
            Deponent
          </Typography>
          
          <Box sx={{ mt: 8 }}>
  <Typography
    sx={{
      fontFamily: "Times New Roman",
      fontSize: "16px",
      lineHeight: 2,
    }}
  >
    This day

    <span
      style={{
        borderBottom: "1px dotted black",
        padding: "0 15px",
        marginLeft: "5px",
        fontWeight: 600,
      }}
    >
      {day}
    </span>

    {" "}of{" "}

    <span
      style={{
        borderBottom: "1px dotted black",
        padding: "0 20px",
        fontWeight: 600,
      }}
    >
      {month}
    </span>

    {" "}20

    <span
      style={{
        borderBottom: "1px dotted black",
        padding: "0 10px",
        fontWeight: 600,
      }}
    >
      {String(year).slice(-2)}
    </span>

    {" "}at{" "}

    <span
      style={{
        borderBottom: "1px dotted black",
        padding: "0 20px",
        fontWeight: 600,
      }}
    >
      {declaration.declarationPlace}
    </span>

    {" "}Before me
  </Typography>
</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Step5Preview;