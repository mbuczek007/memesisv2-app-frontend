import React from 'react';
import Link from '@material-ui/core/Link';
import styled from '@emotion/styled';
import { Link as RouterLink } from 'react-router-dom';

const CardLInk = ({ children, linked, entryId }) => {
  if (!linked) {
    return children;
  }

  return (
    <StyledLink underline='none' component={RouterLink} to={`/view/${entryId}`}>
      {children}
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  color: #000;
  display: block;
`;

export default CardLInk;
