import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled';

const Footer = () => {
  return (
    <Styledfooter>
      <Typography variant='body1' align='center'>
        ewangelizatory.pl
      </Typography>
      <Typography variant='body2' color='textSecondary' align='center'>
        {'Copyright © '}
        <Link component={RouterLink} to='/' color='inherit'>
          ewangelizatory.pl
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Styledfooter>
  );
};

const Styledfooter = styled.footer`
  margin-top: auto;
  padding: 24px 16px;
  background-color: #fff;
  border-top: 1px solid #f3f3f3;
`;

export default Footer;
