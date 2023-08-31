import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import React from "react";
// import { ThemeProvider as StyledThemeProvider } from "styled-components";
const theme = createTheme({
  colors: {
    primary: "#36313D",
    secondary: "#36313D",
    white: "#FFFFFF",
    green: '#00AD6F'
  },
  fonts: ["Prompt","Roboto"],
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em",
  },
  typography: {
    reportDisplay: {
      fontSize: '22px',
      color:"#000",
      fontWeight:'500',
      },
    reportDisplayText: {
      color:"#000",
      fontSize:'14px',
      fontWeight: '400',
    },
    reportDisplayRoboto: {
      fontSize: '22px',
      color:"#000",
      fontWeight:'500',
      fontFamily:"Roboto !important",

      },
    reportDisplayTextRoboto: {
      color:"#000",
      fontSize:'14px',
      fontWeight: '400',
      fontFamily:"Roboto !important",

    },
    reportTitle: {
        fontSize: '16px',
        fontFamily:"Roboto !important",
        color:"#000",
        fontWeight:'500',
        marginTop:'40px'
      },
    reportTitleText: {
      color:"#666666",
      fontSize:'12px',
      fontWeight: '400',
      fontFamily:"Roboto !important",
    },
    paragraph: {
      fontSize: '16px',
      fontFamily:"Roboto !important",
      color:"#000",
      fontWeight:'400',
      lineHeight:'24px'
    },
    paragraphGrey: {
      fontSize: '16px',
      fontFamily:"Roboto !important",
      color:"#777777",
      fontWeight:'400',
      lineHeight:'24px'
    },
    formText: {
      fontSize: '12px',
      fontWeight: '500',
      fontFamily: 'Roboto !important'
    },
    tableTitle: {
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: 'Roboto !important'
    },
      h3: {
        fontSize: '1.2rem',
        '@media (min-width:600px)': {
        fontSize: '1.5rem',
        }
      }
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
        },
        input: {
          fontFamily: "Roboto",
        },
      },
    },
    MuiAlert : {
      styleOverrides: {
        root: {
          "&.MuiAlert-fieldErr" : {
            backgroundColor: '#fff',
            transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            boxShadow: 'none',
            fontFamily: "Roboto",
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.43,
            letterSpacing: '0.01071em',
            display: '-webkit-box',
            display: '-webkit-flex',
            display: '-ms-flexbox',
            display: 'flex',
            color: '#ef5350',
            border: 'none',
            paddingTop: 0,
            "& .MuiAlert-icon" : {
              paddingTop: 0
            },
            "& .MuiAlert-message" : {
              paddingTop: '1px'
            },
          }
        }
      }
    },  
    MuiTabs: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
        },
        indicator: {
          background: "#00AD6F",
          height: 3,
        },
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          textTransform: 'none',
          color:'#777777',
          fontWeight: '400',
          paddingLeft:0,
          paddingRight:0,
          marginRight:'24px',
          "&.Mui-selected": {
            "fontWeight": "600",
            "color" : "#061F19"
          }
        },

      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          textTransform: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          // fontFamily: "Roboto",
          "&.MuiTypography-body1.MuiFormControlLabel-label": {
            fontSize:'12px',
            fontWeight: '400',
            fontFamily: 'Roboto !important',
            lineHeight: '18px',
            color:'rgba(0, 0, 0, 1)'
          }
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",

        }
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          "&.white-regular": {
            background:'#fff',
            minWidth: '180px',
            "& .MuiSelect-select": {
              paddingTop:'8px',
              background:'#fff'
            },
            "&::before, &::after": {
              borderBottom:'none !important'
            }
          }
        }
      }
    },
    MuiSvgIcon:{
      styleOverrides: {
        root: {
          "&.MuiSvgIcon-colorGrey": {
            color: "#ccc"
          },
          "&.MuiSvgIcon-colorGreen": {
            color: "#00AD6F"
          },
          "&.MuiSvgIcon-colorSmallGreen": {
            color: "#00AD6F",
            width: '0.7em'
          }
        }
      }

    },
    MuiCheckbox:{
      styleOverrides: {
        root: {
          "&.MuiCheckbox-colorSuccess": {
            color: "#00AD6F"
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&.variant-right": {
            "& label": {
              right: 0,
              left: 'auto'
            },
            "& input": {
              textAlign: `right`
            }
          },
          "&.white-regular": {
            "& .MuiInputBase-root": {
              minWidth: '180px',
              background: '#fff',
              border: '0.5px solid #EAEAEA',
              borderRadius: '2px',
            }
          }
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        content: {
          textAlign: "left",
        },
        title: {
          fontFamily: "Roboto",
        },
        subheader: {
          fontFamily: "Roboto",
        },
      },
    },
  },
  palette: {
    neutral: {
      main: '#00AD6F',
    },
  }
});

export const MuiTheme = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StyledEngineProvider>
);
// export const Theme = ({ children }) => (
//   <StyledThemeProvider theme={styledTheme}>{children}</StyledThemeProvider>
// );
