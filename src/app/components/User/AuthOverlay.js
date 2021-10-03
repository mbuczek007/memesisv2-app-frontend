import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { toggleAuthOverlayAction } from '../../../store/reducers/authSlice';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import LoginPanel from './LoginPanel';
import RegisterPanel from './RegisterPanel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

const AuthOverlay = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { isLoggedIn, authOverlayOpen } = useSelector((state) => state.auth);
  const [logInFormActive, setLogInFormActive] = useState(true);

  const handleClose = () => {
    dispatch(toggleAuthOverlayAction());

    setTimeout(() => {
      setLogInFormActive(true);
    }, 500);
  };

  const toggleAuthForms = () => {
    setLogInFormActive(!logInFormActive);
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={authOverlayOpen}
      onClose={handleClose}
      aria-labelledby='auth-dialog'
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id='auth-dialog'>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {logInFormActive ? <LoginPanel /> : <RegisterPanel />}
        <Grid container>
          <Grid item>
            <Link href='#' variant='body2' onClick={toggleAuthForms}>
              {logInFormActive
                ? 'Nie posiadasz konta? Zarejestruj się!'
                : 'Posiadasz juz konto? Zaloguj się!'}
            </Link>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AuthOverlay;
