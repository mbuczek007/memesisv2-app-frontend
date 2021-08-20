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
import { getVideoIdFromUrl } from '../utils/utils';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { DebounceInput } from 'react-debounce-input';
import Button from '@material-ui/core/Button';
import YouTube from 'react-youtube';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const AddEntry = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('file');
  const [selectedImagePreview, setSelectedImagePreview] = useState([]);

  const tabs = [
    {
      id: 0,
      type: 'file',
      label: 'Z dysku',
    },
    {
      id: 1,
      type: 'url',
      label: 'Z adresu url',
    },
    {
      id: 2,
      type: 'yt-video',
      label: 'Video z Youtube',
    },
  ];

  const initialAdditionalSettings = {
    disableComments: false,
    sourceType: activeTab,
    source: '',
  };

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
      source: additionalSettings.source,
      source_info: data.entrySourceInfo,
      nick_name: data.entryNick,
      disable_comments: additionalSettings.disableComments,
      source_type: additionalSettings.sourceType,
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

  const handleChangeType = (event, newValue) => {
    if (activeTab !== newValue) {
      setActiveTab(newValue);

      setAdditionalSettings({
        ...additionalSettings,
        sourceType: newValue,
        source: '',
      });
    }
  };

  const handleChangeMediaValue = (e) => {
    setAdditionalSettings({
      ...additionalSettings,
      source: e.target.value,
    });
  };

  const handleChangeUploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    console.log(file);

    setAdditionalSettings({
      ...additionalSettings,
      source: file.name,
    });

    reader.onloadend = () => {
      setSelectedImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const additionalProps = (type) => {
    return {
      id: `media-tab-${type}`,
      'aria-controls': `media-tabpanel-${type}`,
      value: type,
    };
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

            <StyledTabs
              centered
              value={activeTab}
              onChange={handleChangeType}
              aria-label='media source tabs'
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  label={tab.label}
                  {...additionalProps(tab.type)}
                />
              ))}
            </StyledTabs>
            <TabPanel value='file' activeTab={activeTab}>
              {additionalSettings.source && selectedImagePreview.length ? (
                <ImagePlaceholderWrapper href='#'>
                  <span>
                    <img src={selectedImagePreview} alt='' />
                    <IconButton
                      aria-label='delete'
                      onClick={() => {
                        setAdditionalSettings({
                          ...additionalSettings,
                          source: '',
                        });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </ImagePlaceholderWrapper>
              ) : (
                <>
                  <HiddenInput
                    id='contained-button-file'
                    type='file'
                    name='mediaUrl'
                    accept='.png, .jpg, .jpeg'
                    onChange={handleChangeUploadImage}
                  />
                  <label htmlFor='contained-button-file'>
                    <Button
                      variant='contained'
                      color='primary'
                      component='span'
                    >
                      Wybierz plik
                    </Button>
                  </label>
                  <InfoText variant='caption' display='block'>
                    Plik w formacie: png, jpg, jpeg. Maksymalna wielkość pliku:
                    1Mb
                  </InfoText>
                </>
              )}
            </TabPanel>
            <TabPanel value='url' activeTab={activeTab}>
              {additionalSettings.source && activeTab !== 'file' && (
                <ImagePlaceholderWrapper
                  href={additionalSettings.source}
                  target='_blank'
                >
                  <img src={additionalSettings.source} alt='Preview' />
                </ImagePlaceholderWrapper>
              )}
              <InputWrapper>
                <DebounceInput
                  autoFocus
                  debounceTimeout={500}
                  element={TextField}
                  variant='outlined'
                  fullWidth
                  type='url'
                  label='Adres url do zdjęcia'
                  value={additionalSettings.source}
                  onChange={(e, type) => {
                    handleChangeMediaValue(e, type);
                  }}
                  rows='4'
                  placeholder='http://www.adres.pl/nazwa-obrazka.jpg'
                />
              </InputWrapper>
            </TabPanel>
            <TabPanel value='yt-video' activeTab={activeTab}>
              {additionalSettings.source && activeTab !== 'file' && (
                <VideoPlaceholderWrapper>
                  <YouTube
                    videoId={getVideoIdFromUrl(additionalSettings.source)}
                  />
                </VideoPlaceholderWrapper>
              )}
              <InputWrapper>
                <DebounceInput
                  autoFocus
                  debounceTimeout={500}
                  element={TextField}
                  variant='outlined'
                  fullWidth
                  type='url'
                  label='Link do video'
                  value={additionalSettings.source}
                  onChange={(e, type) => {
                    handleChangeMediaValue(e, type);
                  }}
                  rows='4'
                  placeholder='https://www.youtube.com/watch?v=bD6eaJFpW7Q'
                />
              </InputWrapper>
            </TabPanel>

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

const TabPanel = ({ children, activeTab, value }) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== activeTab}
      id={`simple-tabpanel-${value}`}
      aria-labelledby={`simple-tab-${value}`}
    >
      {value === activeTab && <div>{children}</div>}
    </div>
  );
};

const StyledPaper = styled(Paper)`
  padding: 30px;
`;

const StyledTabs = styled(Tabs)`
  margin: 20px 0 25px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const ImagePlaceholderWrapper = styled.a`
  display: block;
  margin: 20px auto;
  text-align: center;

  span {
    display: inline-block;
    position: relative;
  }

  button {
    position: absolute;
    top: -11px;
    right: -50px;
  }

  img {
    max-width: 200px;
    vertical-align: middle;
  }
`;

const VideoPlaceholderWrapper = styled.div`
  position: relative;
  padding-bottom: 26.25%;
  height: 0;
  max-width: 300px;
  margin: 30px auto;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const InfoText = styled(Typography)`
  margin-top: 10px;
`;

export default AddEntry;
