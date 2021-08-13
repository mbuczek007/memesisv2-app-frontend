import React from 'react';
import { StylesProvider, MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from './theme';

const AppTheme = ({ children }) => {
  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

export default AppTheme;
