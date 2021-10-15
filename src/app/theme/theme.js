import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#8d254b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fda92d',
    },
    text: {
      primary: '#1e1633',
      secondary: '#9FA3AC',
    },
    background: {
      default: '#f7f7f7',
    },
    divider: '#F3F3F3',
  },
  typography: {
    fontFamily: 'Signika',
    fontSize: 16,
    fontWeightRegular: 300,
  },
});
