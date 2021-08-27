import React, { useState } from 'react';
import styled from '@emotion/styled';
import { NavLink as RouterLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const headerLinks = [
    {
      id: 0,
      path: '/',
      name: 'Główna',
    },
    {
      id: 1,
      path: '/pending',
      name: 'Oczekujące',
    },
    {
      id: 2,
      path: '/add',
      name: 'Dodaj',
    },
  ];

  return (
    <StyledMuiAppBar position='fixed'>
      <StyledMuiToolbar>
        <StyledPageTitle variant='h6' color='inherit' noWrap>
          <Link component={RouterLink} to='/' color='primary'>
            ewangelizatory.pl
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
        <div>
          <IconButton
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>
        </div>
      </StyledMuiToolbar>
    </StyledMuiAppBar>
  );
};

const StyledMuiAppBar = styled(AppBar)`
  width: 100%;
  box-shadow: none;
  color: rgb(33, 43, 54);
  backdrop-filter: blur(6px);
  background-color: rgba(255, 255, 255, 0.72);
  z-index: 1201;
  border-bottom: 1px solid rgba(145, 158, 171, 0.24);

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
  justify-content: space-between;

  > * {
    flex-basis: 33.333%;

    &:nth-child(2) {
      text-align: center;
    }

    &:nth-child(3) {
      text-align: right;
    }
  }
`;

const StyledPageTitle = styled(Typography)`
  a {
    font-weight: 700;
  }
`;

const StyledLink = styled(Link)`
  text-transform: none;
  margin: ${({ theme }) => theme.spacing(1)}px
    ${({ theme }) => theme.spacing(1.5)}px;

  &,
  &:hover {
    text-decoration: none;
  }

  &.MuiLink-underlineAlways {
    font-weight: 700;
  }
`;

export default Header;
