import { createTheme } from '@mui/material/styles';
import { teal, grey, deepOrange } from '@mui/material/colors';

const darkMode: number = 1;

const lightPalette = {
  background: { default: teal[50] },
  // palette values for light mode
  primary: { main: teal[300] },
  secondary: { main: deepOrange[500] },
  divider: teal[50],
  text: {
    primary: grey[900],
    secondary: grey[800],
  },
};

const darkPalette = {
  background: { default: teal[900] },
  // palette values for light mode
  primary: { main: teal[300] },
  secondary: { main: deepOrange[500] },
  divider: teal[900],
  text: {
    primary: grey[100],
    secondary: grey[200],
  },
};
// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: darkMode === 0 ? 'light' : 'dark',
    ...(darkMode === 0 ? lightPalette : darkPalette),
    // : darkMode ? 'dark' : lightPalette,
    // primary: {
    //   main: '#556cd0',
    // },
    // secondary: {
    //   main: '#19857b',
    // },
    // error: {
    //   main: red.A400,
    // },
  },
  components: {
    // Name of the component
    MuiOutlinedInput: {
      defaultProps: {},
      styleOverrides: {
        root: {
          margin: '0em 0.4em',
          '&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
            {
              border: '0px solid',
              //borderColor: 'white',
              //backgroundColor: 'grey',
            },
          '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'black',
              border: '1px solid',
            },
          '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'primary',
            },
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
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: teal[300], // unchecked color
        },
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