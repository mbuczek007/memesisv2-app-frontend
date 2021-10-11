import React from 'react';
import { Helmet } from 'react-helmet-async';

const PageTitle = ({ title }) => {
  const mainTtile = `${process.env.REACT_APP_TITLE}`;
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
