import { createTheme } from '@mui/material/styles';
import { teal, grey, deepOrange } from '@mui/material/colors';
import { text } from 'stream/consumers';

//const darkMode: string = 'dark';

const lightPalette = {
  background: { default: teal[100] },
  primary: {
    main: teal[300],
    dark: teal[100],
    light: teal[50],
  },
  secondary: { main: deepOrange[800] },
  divider: teal[100],
  text: {
    primary: grey[900],
    secondary: grey[800],
  },
};

const darkPalette = {
  background: { default: teal[900] },
  primary: {
    main: teal[700],
    dark: teal[800],
  },
  secondary: { main: deepOrange[300] },
  divider: teal[800],
  text: {
    primary: grey[100],
    secondary: grey[200],
  },
};
// A custom theme for this app
const createBabelTheme = (darkMode: string) =>
  createTheme({
    palette: {
      mode: darkMode === 'light' ? 'light' : 'dark',
      ...(darkMode === 'light' ? lightPalette : darkPalette),
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
            minWidth: '10em',
            margin: '0em 0em',
            padding: '0.2em 0 0.2em 0.75em',
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
            '& textarea': {
              overflowY: 'scroll',
              scrollbarWidth: 'none' /* For Firefox */,
              '-ms-overflow-style':
                'none' /* For Internet Explorer and Edge */,
            },
          },
          inputSizeSmall: {
            //padding: '2px 10px', // Adjust values as needed
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
            color: darkMode === 'light' ? grey[700] : grey[100], // unchecked color
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

export default createBabelTheme;
