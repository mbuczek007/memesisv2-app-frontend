import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Grid from '@mui/material/Grid';

const NotFound = () => (
  <Grid item xs={12} sm={12} md={12}>
    <Helmet>
      <title>Błąd 404</title>
    </Helmet>
    <h2>404 - Nie znaleziono strony</h2>
    <p>
      <Link to='/'>Powrót na stronę główną</Link>
    </p>
  </Grid>
);

export default NotFound;
