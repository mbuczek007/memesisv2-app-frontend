import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';
import ButtonLoading from '../shared/ButtonLoading';
import { logIn } from '../../../store/reducers/authSlice';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';

const LoginPanel = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    setLoading(true);

    dispatch(logIn(data.login, data.password))
      .then(() => {
        setLoading(false);
        reset();
        enqueueSnackbar('Zostałeś zalogowany', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      })
      .catch((e) => {
        setLoading(false);
        reset();

        enqueueSnackbar(e.response.data.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      });
  };

  if (isLoggedIn) {
    return <Redirect to='/' />;
  }

  return (
    <Grid item xs={12} sm={12} md={12}>
      <Typography variant='h6' component='h2'>
        Logowanie
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant='outlined'
          margin='normal'
          fullWidth
          id='login'
          label='Login'
          autoFocus
          error={errors.login ? true : false}
          helperText={errors.login && errors.login.message}
          {...register('login', {
            required: 'To pole jest wymagane',
          })}
        />
        <StyledFormControl
          variant='outlined'
          fullWidth
          margin='normal'
          error={errors.password ? true : false}
        >
          <InputLabel htmlFor='loginPassword'>Hasło</InputLabel>
          <OutlinedInput
            id='loginPassword'
            autoComplete='current-password'
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'To pole jest wymagane',
            })}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  edge='end'
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={46}
          />
          <FormHelperText error={errors.password ? true : false}>
            {errors.password && errors.password.message}
          </FormHelperText>
        </StyledFormControl>

        <ButtonLoading loading={loading} ctaText='Zaloguj' />
      </form>
    </Grid>
  );
};

const StyledFormControl = styled(FormControl)`
  .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline,
  .MuiOutlinedInput-notchedOutline {
    ${({ isValid }) =>
      isValid &&
      `
    border-color: green;

  `}
  }
`;

export default LoginPanel;
