import React from 'react';
import styled from '@emotion/styled';
import { NavLink as RouterLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const headerLinks = [
  {
    id: 0,
    path: '/',
    name: 'Główna',
  },
  {
    id: 1,
    path: '/pending',
    name: 'W kolejce',
  },
  {
    id: 2,
    path: '/add',
    name: 'Dodaj',
  },
];

const Header = () => {
  return (
    <StyledMuiAppBar position='sticky' color='default' elevation={0}>
      <StyledMuiToolbar>
        <StyledPageTitle variant='h6' color='inherit' noWrap>
          <Link component={RouterLink} to='/' color='inherit'>
            Memesis
          </Link>
        </StyledPageTitle>
        <nav>
          <ul>
            {headerLinks.map((link) => (
              <li key={link.id}>
                <StyledLink
                  component={RouterLink}
                  to={link.path}
                  variant='button'
                  color='textPrimary'
                  activeClassName='MuiLink-underlineAlways'
                  exact
                >
                  {link.name}
                </StyledLink>
              </li>
            ))}
          </ul>
        </nav>
      </StyledMuiToolbar>
    </StyledMuiAppBar>
  );
};

const StyledMuiAppBar = styled(AppBar)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
  }
`;

const StyledMuiToolbar = styled(Toolbar)`
  flex-wrap: wrap;
`;

const StyledPageTitle = styled(Typography)`
  flex-grow: 1;
`;

const StyledLink = styled(Link)`
  margin: ${({ theme }) => theme.spacing(1)}px
    ${({ theme }) => theme.spacing(1.5)}px;

  &.MuiLink-underlineAlways {
    font-weight: 700;
    text-decoration: none;
  }
`;

export default Header;
