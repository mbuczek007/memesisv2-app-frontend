import { createSlice } from '@reduxjs/toolkit';
import AuthService from '../../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));

const initialAuthState = user
  ? { authOverlayOpen: false, isLoggedIn: true, user }
  : { authOverlayOpen: false, isLoggedIn: false, user: null };

export const slice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logInAction: (state, action) => {
      state.authOverlayOpen = false;
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    logOutAction: (state) => {
      state.authOverlayOpen = false;
      state.isLoggedIn = false;
      state.user = null;
    },
    toggleAuthOverlayAction: (state) => {
      state.authOverlayOpen = !state.authOverlayOpen;
    },
  },
});

export const { logInAction, logOutAction, toggleAuthOverlayAction } =
  slice.actions;

export const logIn = (name, password) => (dispatch) => {
  return AuthService.login({ name, password })
    .then((data) => {
      dispatch(
        logInAction({
          user: data,
        })
      );

      return Promise.resolve();
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};

export const logout = () => (dispatch) => {
  dispatch(logOutAction());
  AuthService.logOut();
};

const checkAuthTimeout = (expirationTime) => (dispatch) => {
  setTimeout(() => {
    dispatch(logout());
  }, expirationTime * 1000);
};

export const checkAuth = () => (dispatch) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    dispatch(logout());

    return null;
  }

  if (Math.floor(new Date().getTime() / 1000) > user.expirationTime) {
    dispatch(logout());
  } else {
    dispatch(
      logInAction({
        user,
      })
    );

    dispatch(checkAuthTimeout(3600));
  }
};

export default slice.reducer;
