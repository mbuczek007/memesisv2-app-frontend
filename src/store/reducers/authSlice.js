import { createSlice } from '@reduxjs/toolkit';
import AuthService from '../../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));

const initialAuthState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

export const slice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logInAction: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    logOutAction: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { logInAction, logOutAction } = slice.actions;

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
    dispatch(logOutAction());
  }, expirationTime * 1000);
};

export const checkAuth = () => (dispatch) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    dispatch(logOutAction());

    return null;
  }

  if (Math.floor(new Date().getTime() / 1000) > user.expirationTime) {
    dispatch(logOutAction());
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
