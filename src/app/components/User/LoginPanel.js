import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import ButtonLoading from '../shared/ButtonLoading';
import { logIn } from '../../../store/reducers/authSlice';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';

const LoginPanel = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    formState,
  } = useForm({
    mode: 'onChange',
  });
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { isDirty, isValid } = formState;

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
        <FormControl
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
                <Button
                  aria-label='toggle password visibility'
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  edge='end'
                >
                  {showPassword ? 'Ukryj' : 'Pokaz'}
                </Button>
              </InputAdornment>
            }
            labelWidth={46}
          />
          <FormHelperText error={errors.password ? true : false}>
            {errors.password && errors.password.message}
          </FormHelperText>
        </FormControl>

        <ButtonLoading
          isDisabled={!isDirty || !isValid}
          loading={loading}
          ctaText='Zaloguj'
        />
      </form>
    </Grid>
  );
};

export default LoginPanel;
