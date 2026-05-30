import { createTheme } from "@mui/material/styles";

export const themeConfig = () => {
  return createTheme({
    cssVariables: {
      colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: "#550fae",
          },
        },
        components: {
          MuiTable: {
            styleOverrides: {
              root: {
                borderCollapse: "collapse", // Ensures proper cell border rendering
                border: "1px solid #ccc", // Full border around the table
              },
            },
          },
          MuiButton: {
            defaultProps: {
              variant: "contained", // Set default alignment for all TableCell components
            },
          },
          MuiTableCell: {
            defaultProps: {
              align: "center", // Set default alignment for all TableCell components
            },
            styleOverrides: {
              // root: {
              //   border: "1px solid black" // Borders for all sides of each cell
              // },
              head: {
                fontWeight: "bold",
                border: "1px solid #ccc",
              },
              body: { backgroundColor: "#f7f7f7", border: "1px solid #ccc" },
            },
          },
        },
      },
      dark: {
        components: {
          MuiTableCell: {
            defaultProps: {
              align: "center", // Set default alignment for all TableCell components
            },
            styleOverrides: {
              head: {
                fontWeight: "bold",
              },
              body: { backgroundColor: "#000" },
            },
          },
        },
        // palette: {
        //   // background: {
        //   //   default: "red",
        //   //   paper: "red"
        //   // },
        //   primary: {
        //     main: "#996600"
        //   }
        // }
        // palette: {
        //   background: {
        //     default: "#2A4364",
        //     paper: "#112E4D"
        //   }
        // }
        // components: {
        //   MuiAppBar: {
        //     styleOverrides: {
        //       // Name of the slot
        //       root: ({ theme }) => ({
        //         backgroundColor: theme.palette.primary.main // Dynamically use primary.main
        //       })
        //     }
        //   }
        // }
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });
};
