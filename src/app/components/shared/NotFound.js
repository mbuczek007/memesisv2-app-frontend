import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Grid from '@material-ui/core/Grid';

const NotFound = () => (
  <StyledGrid item xs={12} sm={12} md={12}>
    <Helmet>
      <title>Błąd 404</title>
    </Helmet>
    <h2>404 - Nie znaleziono strony</h2>
    <p>
      <Link to='/'>Powrót na stronę główną</Link>
    </p>
  </StyledGrid>
);

const StyledGrid = styled(Grid)`
  text-align: center;
`;

export default NotFound;
