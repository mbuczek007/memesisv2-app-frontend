import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { StylesProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { Global, css } from '@emotion/react';

const AppTheme = ({ children }) => {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Global
          styles={css`
            @import url('https://fonts.cdnfonts.com/css/signika');
          `}
        />
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StylesProvider>
  );
};

export default AppTheme;
