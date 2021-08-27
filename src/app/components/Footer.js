import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled';

const Footer = () => {
  return (
    <StyledFooter>
      <Typography variant='h6' align='center' gutterBottom>
        ewangelizatory.pl
      </Typography>
      <Typography variant='body2' color='textSecondary' align='center'>
        {'Copyright © '}
        <Link component={RouterLink} to='/' color='inherit'>
          ewangelizatory.pl
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: ${({ theme }) => theme.spacing(6)}px;
  margin-top: auto;
`;

export default Footer;
