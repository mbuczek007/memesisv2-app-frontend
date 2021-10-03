import React, { useState } from 'react';
import styled from '@emotion/styled';
import PageTitle from '../shared/PageTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ButtonLoading from '../shared/ButtonLoading';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useForm } from 'react-hook-form';
import EntryDataService from '../../../services/entry.service';
import { getVideoIdFromUrl } from '../../utils/utils';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DebounceInput } from 'react-debounce-input';
import Button from '@mui/material/Button';
import YouTube from 'react-youtube';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';

const AddEntry = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('file');
  const [selectedImagePreview, setSelectedImagePreview] = useState([]);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [
        { align: '' },
        { align: 'center' },
        { align: 'right' },
        { align: 'justify' },
      ],
      ['clean'],
    ],
  };

  const tabs = [
    {
      id: 0,
      type: 'file',
      label: 'Zdjęcie z dysku',
    },
    {
      id: 1,
      type: 'text',
      label: 'Tekst',
    },
    {
      id: 2,
      type: 'url',
      label: 'Z adresu url',
    },
    {
      id: 3,
      type: 'yt-video',
      label: 'Video z Youtube',
    },
  ];

  const initialAdditionalSettings = {
    description: null,
    disableComments: false,
    isPrivate: false,
    sourceType: activeTab,
    source: '',
  };

  const [additionalSettings, setAdditionalSettings] = useState(
    initialAdditionalSettings
  );

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

    const formData = new FormData();
    formData.append('title', data.entryTitle);

    additionalSettings.description &&
      formData.append('description', additionalSettings.description);

    data.entrySourceInfo &&
      formData.append('source_info', data.entrySourceInfo);

    formData.append('source', additionalSettings.source);
    formData.append('disable_comments', additionalSettings.disableComments);
    formData.append('is_private', additionalSettings.isPrivate);
    formData.append('source_type', additionalSettings.sourceType);
    formData.append('user_id', user.id);

    EntryDataService.createEntry(formData)
      .then((response) => {
        setLoading(false);
        reset();
        setAdditionalSettings(initialAdditionalSettings);
        enqueueSnackbar(response.data.message, {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar(
          e.response.status !== 413 ? e.response.data.message : e.response.data,
          {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          }
        );
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

    setAdditionalSettings({
      ...additionalSettings,
      source: file,
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

  const handleChangeDescription = (value) => {
    setAdditionalSettings({
      ...additionalSettings,
      description: value,
    });
  };

  return (
    <>
      <PageTitle title='Dodaj nowy ewangelizator' />
      <Typography variant='h6' component='h2'>
        Dodaj nowy ewangelizator
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
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

          <Tabs
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
          </Tabs>
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
                  <Button variant='contained' color='primary' component='span'>
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
                fullWidth
                debounceTimeout={500}
                element={TextField}
                variant='outlined'
                type='url'
                label='Link do video'
                value={additionalSettings.source}
                onChange={(e, type) => {
                  handleChangeMediaValue(e, type);
                }}
                placeholder='https://www.youtube.com/watch?v=bD6eaJFpW7Q'
              />
            </InputWrapper>
          </TabPanel>

          <Grid item xs={12} sm={12}>
            <ReactQuill
              value={additionalSettings.description}
              onChange={handleChangeDescription}
              modules={modules}
              placeholder='Opis..'
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
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
            <FormControlLabel
              control={
                <Switch
                  checked={additionalSettings.isPrivate}
                  onChange={(e) => {
                    setAdditionalSettings({
                      ...additionalSettings,
                      [e.target.name]: e.target.checked,
                    });
                  }}
                  name='isPrivate'
                />
              }
              label='Prywatny'
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
        </Grid>
      </form>
    </>
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
