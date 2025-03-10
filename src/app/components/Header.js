import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {
  logout,
  toggleAuthOverlayAction,
} from '../../store/reducers/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import Stack from '@mui/material/Stack';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { stringAvatar } from '../utils/utils';
import { useHistory } from 'react-router-dom';

const Header = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    dispatch(logout());
    handleClose();
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
  ];

  return (
    <StyledAppBar elevation={0}>
      <StyledToolbar>
        <Stack direction='row' alignItems='center' spacing={9}>
          <RouterLink to='/'>
            <MainLogo src='/img/logo.png' />
          </RouterLink>
          <StyledNav>
            <ul>
              {headerLinks.map((link) => (
                <li key={link.id}>
                  <StyledMenuLink
                    component={RouterLink}
                    to={link.path}
                    activeClassName='active'
                    exact
                  >
                    {link.name}
                  </StyledMenuLink>
                </li>
              ))}
            </ul>
          </StyledNav>
        </Stack>
        <Stack direction='row' alignItems='center' spacing={3}>
          {!isLoggedIn ? (
            <AccountIconButton
              onClick={() => {
                dispatch(toggleAuthOverlayAction());
              }}
            >
              <AccountCircleIcon />
            </AccountIconButton>
          ) : (
            <>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <Avatar {...stringAvatar(user.username)} />
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
                <MenuItem>{user && user.username}</MenuItem>
                <MenuItem onClick={handleLogOut}>Wyloguj</MenuItem>
              </Menu>
            </>
          )}
          <Button
            disableElevation
            startIcon={<FileUploadOutlinedIcon />}
            variant='contained'
            color='secondary'
            size='small'
            onClick={() => {
              isLoggedIn
                ? history.push({ pathname: '/add' })
                : dispatch(toggleAuthOverlayAction());
            }}
          >
            Dodaj
          </Button>
        </Stack>
      </StyledToolbar>
    </StyledAppBar>
  );
};

const StyledAppBar = styled(AppBar)``;

const StyledToolbar = styled(Toolbar)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const StyledNav = styled.nav`
  margin-left: 80px;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-block;
    padding-right: 25px;
  }
`;

const StyledMenuLink = styled(Link)`
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  font-size: 14px;
  opacity: 0.8;
  text-transform: uppercase;

  &.active {
    opacity: 1;
  }
`;

const MainLogo = styled.img`
  vertical-align: middle;
  width: 100%;
  height: auto;
  max-width: 184px;
`;

const AccountIconButton = styled(IconButton)`
  svg {
    color: #fff;
  }
`;

export default Header;
