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
import AddEntryOverlay from './Entries/AddEntryOverlay';

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [addEntryOverlay, setAddEntryOverlay] = useState(false);
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
            <MainLogo src='img/logo.png' />
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
          <AddButton
            disableElevation
            startIcon={<FileUploadOutlinedIcon />}
            variant='contained'
            color='secondary'
            size='small'
            onClick={() => {
              isLoggedIn
                ? setAddEntryOverlay(true)
                : dispatch(toggleAuthOverlayAction());
            }}
          >
            Dodaj
          </AddButton>
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
        </Stack>
      </StyledToolbar>
      <AddEntryOverlay
        open={addEntryOverlay}
        handleSetOpen={() => {
          setAddEntryOverlay(false);
        }}
      />
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
  font-weight: 300;
  text-decoration: none;
  font-size: 16px;
  opacity: 0.8;

  &.active {
    opacity: 1;
    font-weight: 500;
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

const AddButton = styled(Button)`
  // &,
  // &:hover,
  // &:focus {
  //   background-color: #fff;
  //   color: #d5b036;
  // }
`;

export default Header;
