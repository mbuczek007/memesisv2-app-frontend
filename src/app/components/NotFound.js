import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => (
  <>
    <Helmet>
      <title>Błąd 404</title>
    </Helmet>
    <h2>404 - Nie znaleziono strony</h2>
    <p>
      <Link to='/'>Powrót na stronę główną</Link>
    </p>
  </>
);

export default NotFound;
