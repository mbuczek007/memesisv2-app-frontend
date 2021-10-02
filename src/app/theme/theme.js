import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#D5B036',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fd4e54',
    },
    text: {
      primary: '#1e1633',
      secondary: '#9FA3AC',
    },
    background: {
      default: '#fcf9ef',
    },
    divider: '#F3F3F3',
  },
  typography: {
    fontFamily: 'Signika',
    fontSize: 16,
    fontWeightRegular: 300,
  },
});
