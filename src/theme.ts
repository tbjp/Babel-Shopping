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
          margin: '0 0.5em',
        },
      },
    },
  },
});

export default theme;
