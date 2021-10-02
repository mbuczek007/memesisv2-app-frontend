import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ButtonLoading from '../shared/ButtonLoading';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import AuthService from '../../../services/auth.service';
import { logIn } from '../../../store/reducers/authSlice';
import Button from '@mui/material/Button';

const RegisterPanel = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    formState,
    reset,
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

    AuthService.register({
      name: data.login,
      email: data.email,
      password: data.password,
      sex: data.gender,
    })
      .then(() => {
        reset();

        dispatch(logIn(data.login, data.password))
          .then(() => {
            enqueueSnackbar(
              'Rejestracja przebiegła pomyślnie. Zostałeś zalogowany',
              {
                variant: 'success',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'center',
                },
              }
            );
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
        Rejestracja
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant='outlined'
          margin='normal'
          fullWidth
          id='login'
          label='Nazwa uzytkownia'
          autoFocus
          error={errors.login ? true : false}
          helperText={errors.login && errors.login.message}
          required={true}
          name='login'
          autoComplete='login'
          {...register('login', {
            required: 'To pole jest wymagane',
            pattern: {
              value: /^[A-Za-z0-9_.]+$/,
              message: 'Dopuszczalne znaki to: A-Z a-z 0-9 . _',
            },
            minLength: {
              value: 3,
              message: 'Nazwa uzytkownika powinna zawierać od 3 do 20 znaków',
            },
            maxLength: {
              value: 20,
              message: 'Nazwa uzytkownika powinna zawierać od 3 do 20 znaków',
            },
          })}
        />
        <TextField
          variant='outlined'
          margin='normal'
          fullWidth
          id='email'
          type='email'
          label='Adres e-mail'
          error={errors.email ? true : false}
          helperText={errors.email && errors.email.message}
          name='email'
          autoComplete='email'
          required={true}
          {...register('email', {
            required: 'To pole jest wymagane',
            pattern: {
              value:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Format adresu e-mail nie jest poprawny',
            },
            maxLength: {
              value: 100,
              message: 'Email powinien mieścić się w zakresie 100 znaków',
            },
          })}
        />
        <FormControl
          variant='outlined'
          fullWidth
          margin='normal'
          error={errors.password ? true : false}
          required={true}
        >
          <InputLabel htmlFor='loginPassword'>Hasło</InputLabel>
          <OutlinedInput
            id='password'
            autoComplete='current-password'
            type={showPassword ? 'text' : 'password'}
            name='password'
            {...register('password', {
              required: 'To pole jest wymagane',
              pattern: {
                value:
                  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
                message:
                  'Hasło powinno zawierać minimum 8 znaków, jedną duzą literę, jedną małą literę, liczbę oraz znak specjalny',
              },
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

        <FormControl component='fieldset'>
          <FormLabel component='legend'>Jestem</FormLabel>
          <RadioGroup
            row
            aria-label='gender'
            name='gender'
            {...register('gender')}
          >
            <FormControlLabel value='1' control={<Radio />} label='Kobietą' />
            <FormControlLabel value='2' control={<Radio />} label='Męzczyzną' />
          </RadioGroup>
        </FormControl>

        <ButtonLoading
          isDisabled={!isDirty || !isValid}
          loading={loading}
          ctaText='Zarejestruj'
        />
      </form>
    </Grid>
  );
};

export default RegisterPanel;
