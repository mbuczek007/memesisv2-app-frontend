import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Switch } from 'react-router-dom';
import AppTheme from './theme/AppTheme';
import Entries from './components/Entries/Entries';
import AddEntry from './components/Entries/AddEntry';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/shared/NotFound';
import { SnackbarProvider } from 'notistack';
import LoginPanel from './components/User/LoginPanel';
import { checkAuth } from '../store/reducers/authSlice';
import { useDispatch } from 'react-redux';
import RegisterPanel from './components/User/RegisterPanel';
import Toolbar from '@mui/material/Toolbar';
import styled from '@emotion/styled';
import Stack from '@mui/material/Stack';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <AppTheme>
      <HelmetProvider>
        <SnackbarProvider>
          <PageWrapper>
            <Header />
            <Toolbar />
            <MainContainer component='main' maxWidth={false}>
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
                  <Route path='/signup' exact>
                    <RegisterPanel />
                  </Route>
                  <Route path='/add' exact>
                    <AddEntry />
                  </Route>
                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
              </Grid>
            </MainContainer>
            <Footer />
          </PageWrapper>
        </SnackbarProvider>
      </HelmetProvider>
    </AppTheme>
  );
};

const MainContainer = styled(Container)`
  max-width: 750px;
  margin-top: 55px;
  margin-bottom: 60px;
`;

const PageWrapper = styled(Stack)`
  min-height: 100vh;
`;

export default App;
