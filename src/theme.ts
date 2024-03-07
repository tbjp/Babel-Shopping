import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd0',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    // Name of the component
    MuiOutlinedInput: {
      defaultProps: {},
      styleOverrides: {
        root: {
          margin: '0em 0.4em',
        },
        inputSizeSmall: {
          padding: '5px 10px', // Adjust values as needed
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: '0.05em',
          paddingBottom: '0.05em',

          // Optionally target dense ListItems:
          // '&.Mui-dense': {
          //   paddingTop: '2px',
          //   paddingBottom: '2px',
          // },
        },
      },
    },
  },
  typography: {
    fontSize: 14,
  },
});

export default theme;
