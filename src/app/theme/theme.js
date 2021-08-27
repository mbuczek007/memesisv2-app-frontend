import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#fda92d',
    },
    secondary: {
      light: '#78809e',
      main: '#dc004e',
    },
    tertiary: {
      main: '#F4F6F8',
    },
    text: {
      primary: '#212b36',
    },
  },
  typography: {
    htmlFontSize: 17,
  },
});
