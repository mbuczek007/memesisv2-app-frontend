import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Switch } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import Entries from './components/Entries/Entries';
import AddEntry from './components/Entries/AddEntry';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/shared/NotFound';
import { SnackbarProvider } from 'notistack';
import LoginPanel from './components/User/LoginPanel';
import { checkAuth } from '../store/reducers/authSlice';
import { useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

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
                  <Route path='/page/:page'>
                    <Entries status='accepted' />
                  </Route>
                  <Route path='/pending/:page?' exact>
                    <Entries key='pending' status='pending' />
                  </Route>
                  <Route path='/view/:viewEntryId'>
                    <Entries key='view' />
                  </Route>
                  <Route path='/login' exact>
                    <LoginPanel />
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
`;

const StyledMuiContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing(14)}px;
  padding-bottom: ${({ theme }) => theme.spacing(6)}px;
  max-width: 750px;
`;

export default App;
