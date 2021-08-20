import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import EntryDataService from '../../services/entry.service';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PageTitle from './PageTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import YouTube from 'react-youtube';
import moment from 'moment';
import 'moment/locale/pl';

const Entries = ({ status }) => {
  const itemsPerPage = 2;
  let history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [totalEntryPages, setTotalEntryPages] = useState(0);
  const { page } = useParams();
  const pageInt = page ? parseInt(page) : 1;
  const [changeEntriesCount, setChangeEntriesCount] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    EntryDataService.getAllEntries(status, pageInt - 1, itemsPerPage)
      .then((response) => {
        setEntries(response.data.entries);
        setTotalEntryPages(response.data.totalPages);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setEntries([]);
      });
  }, [status, pageInt, changeEntriesCount]);

  const generatePageTitle = () => {
    let title = '';

    if (status === 'accepted') {
      title = 'Główna';
    } else if (status === 'pending') {
      title = 'W kolejce';
    }

    return title;
  };

  const handleDeleteEntry = (entryId) => {
    EntryDataService.deleteEntry(entryId)
      .then((response) => {
        setChangeEntriesCount(!changeEntriesCount);
        enqueueSnackbar(response.data.message, { variant: 'success' });
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      });
  };

  const handleAcceptEntry = (entryId) => {
    EntryDataService.acceptEntry(entryId)
      .then((response) => {
        setChangeEntriesCount(!changeEntriesCount);
        enqueueSnackbar(response.data.message, { variant: 'success' });
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      });
  };

  const handlePageChange = (event, value) => {
    let pathname = '';

    if (status === 'pending') {
      pathname = `/${status}/${value}`;
    } else if (status === 'accepted') {
      pathname = `/page/${value}`;
    }

    history.push({ pathname });
  };

  const ytOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
      {isLoading ? (
        <LoaderWrapper>
          <PageTitle title='Ładowanie...' />
          <CircularProgress />
        </LoaderWrapper>
      ) : (
        <>
          <PageTitle title={generatePageTitle()} />
          {!entries.length ? (
            <Typography variant='h6' align='center' component='h4'>
              Nie znaleziono wpisów.
            </Typography>
          ) : (
            <>
              {entries.map((entry) => (
                <ItemWrapper key={entry.entry_id}>
                  <StyledMuiCard variant='outlined' square>
                    <p>
                      <strong>Id: </strong>
                      {entry.entry_id}
                    </p>
                    <p>
                      <strong>Title: </strong>
                      {entry.title}
                    </p>
                    <p>
                      <strong>Description: </strong>
                      {entry.description}
                    </p>
                    <p>
                      <strong>Nick: </strong>
                      {entry.nick_name}
                    </p>

                    {entry.source_type === 'yt-video' ? (
                      <VideoWrapper>
                        <YouTube videoId={entry.source} opts={ytOpts} />
                      </VideoWrapper>
                    ) : (
                      <p>
                        <strong>Source: </strong>
                        <img src={entry.source} alt={entry.title} />
                      </p>
                    )}

                    <p>
                      <strong>Created date: </strong>
                      {moment(entry.created_date).fromNow()}
                    </p>
                    {!entry.is_accepted && (
                      <Button
                        onClick={() => handleAcceptEntry(entry.entry_id)}
                        variant='contained'
                        color='primary'
                        startIcon={<SaveIcon />}
                      >
                        Accept
                      </Button>
                    )}

                    <Button
                      onClick={() => handleDeleteEntry(entry.entry_id)}
                      variant='contained'
                      color='secondary'
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </StyledMuiCard>
                </ItemWrapper>
              ))}
              <Pagination
                count={totalEntryPages}
                page={pageInt}
                color='primary'
                shape='rounded'
                variant='outlined'
                onChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </Grid>
  );
};

const LoaderWrapper = styled.div`
  text-align: center;
`;

const ItemWrapper = styled.article`
  margin-bottom: ${({ theme }) => theme.spacing(8)}px;
  padding: 40px 70px 35px;
  background-color: #fafafa;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;

const StyledMuiCard = styled(Paper)`
  text-align: center;
  padding: 20px;
  margin-bottom: 4px;

  img {
    width: 100%;
    height: auto;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export default Entries;
