import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import ButtonLoading from '../shared/ButtonLoading';
import { logIn } from '../../../store/reducers/authSlice';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';

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
