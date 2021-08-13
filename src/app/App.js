import React from 'react';
import styled from '@emotion/styled';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Switch } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import Entries from './components/Entries';
import AddEntry from './components/AddEntry';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import { SnackbarProvider } from 'notistack';

const App = () => {
  return (
    <AppTheme>
      <HelmetProvider>
        <SnackbarProvider>
          <RootElem>
            <Header />
            <StyledMuiContainer component='main'>
              <Grid container>
                <Switch>
                  <Route path='/' exact>
                    <Entries status='accepted' />
                  </Route>
                  <Route path='/pending' exact>
                    <Entries key='pending' status='pending' />
                  </Route>
                  <Route path='/add' exact>
                    <AddEntry />
                  </Route>
                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
              </Grid>
            </StyledMuiContainer>
            <Footer />
          </RootElem>
        </SnackbarProvider>
      </HelmetProvider>
    </AppTheme>
  );
};

const RootElem = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  background-color: #f3f3f3;
`;

const StyledMuiContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing(8)}px;
  padding-bottom: ${({ theme }) => theme.spacing(6)}px;
  max-width: 750px;
`;

export default App;
