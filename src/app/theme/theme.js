import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#006bb5',
    },
    secondary: {
      light: '#78809e',
      main: '#dc004e',
    },
    tertiary: {
      main: '#F4F6F8',
    },
    text: {
      primary: '#263238',
    },
  },
  typography: {
    htmlFontSize: 17,
  },
});
