import React, { useState } from 'react';
import styled from '@emotion/styled';
import PageTitle from './PageTitle';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ButtonLoading from './ButtonLoading';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Alert from '@material-ui/lab/Alert';
import { useForm } from 'react-hook-form';
import EntryDataService from '../../services/entry.service';

const AddEntry = () => {
  const initialAdditionalSettings = {
    disableComments: false,
    sourceTypeId: 1,
  };
  const [loading, setLoading] = useState(false);
  const [additionalSettings, setAdditionalSettings] = useState(
    initialAdditionalSettings
  );
  const [resultStatus, setResultStatus] = useState({
    message: null,
    type: 'error',
  });

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
    EntryDataService.createEntry({
      title: data.entryTitle,
      description: data.entryDescription,
      source: 'image_from_app.png',
      source_info: data.entrySourceInfo,
      nick_name: data.entryNick,
      disable_comments: additionalSettings.disableComments,
      source_type_id: additionalSettings.sourceTypeId,
    })
      .then((response) => {
        setLoading(false);
        reset();
        setAdditionalSettings(initialAdditionalSettings);
        setResultStatus({
          ...resultStatus,
          message: 'Wpis został pomyślnie dodany',
          type: 'success',
        });
      })
      .catch((e) => {
        setLoading(false);
        setResultStatus({
          ...resultStatus,
          message: e.response.data.message,
          type: 'error',
        });
      });
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
      <PageTitle title='Dodaj nowy wpis' />
      <StyledPaper>
        <Typography align='center' component='h2' variant='h5' color='inherit'>
          Dodaj nowy
        </Typography>

        {resultStatus.message && (
          <Alert severity={resultStatus.type}>{resultStatus.message}</Alert>
        )}

        <Grid container spacing={3}>
          <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
            <Grid item xs={12} sm={12}>
              <TextField
                error={errors.entryTitle ? true : false}
                id='entry-title'
                label='Tytuł'
                helperText={errors.entryTitle && errors.entryTitle.message}
                variant='outlined'
                {...register('entryTitle', {
                  required: 'To pole jest wymagane',
                  minLength: {
                    value: 3,
                    message: 'Tytuł powinien mieć minimum 3 znaki',
                  },
                  maxLength: {
                    value: 200,
                    message: 'Tytuł moze zawierać maksymalnie 200 znaków',
                  },
                })}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                id='entry-description'
                label='Opis'
                multiline
                rows={4}
                variant='outlined'
                {...register('entryDescription')}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                id='entry-source-info'
                label='Źródło'
                rows={4}
                variant='outlined'
                {...register('entrySourceInfo', {
                  maxLength: {
                    value: 1000,
                    message: 'Tytuł moze zawierać maksymalnie 1000 znaków',
                  },
                })}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                error={errors.entryNick ? true : false}
                id='entry-nick'
                label='Nick'
                helperText={errors.entryNick && errors.entryNick.message}
                variant='outlined'
                {...register('entryNick', {
                  required: 'To pole jest wymagane',
                  minLength: {
                    value: 3,
                    message: 'Nick powinien zawierać minimum 3 znaki',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Nick moze zawierać maksymalnie 50 znaków',
                  },
                })}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={additionalSettings.disableComments}
                    onChange={(e) => {
                      setAdditionalSettings({
                        ...additionalSettings,
                        [e.target.name]: e.target.checked,
                      });
                    }}
                    name='disableComments'
                  />
                }
                label='Wyłącz komentowanie'
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <ButtonLoading loading={loading} ctaText='Dodaj Wpis' />
            </Grid>
          </form>
        </Grid>
      </StyledPaper>
    </Grid>
  );
};

const StyledPaper = styled(Paper)`
  padding: 30px;
`;

export default AddEntry;
