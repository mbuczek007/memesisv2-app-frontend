import React from 'react';
import { Helmet } from 'react-helmet-async';

const PageTitle = ({ title }) => {
  const mainTtile = 'MeMesis';
  return (
    <Helmet>
      <title>
        {mainTtile}
        {title ? ' - ' + title : ''}
      </title>
    </Helmet>
  );
};

export default PageTitle;
