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
import { useSnackbar } from 'notistack';

const Entries = ({ status }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    EntryDataService.getAllEntries(status)
      .then((response) => {
        setEntries(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, [status]);

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
        setEntries(entries.filter((entry) => entry.entry_id !== entryId));
        enqueueSnackbar(response.data.message, { variant: 'success' });
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      });
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
                    <p>
                      <strong>Source: </strong>
                      {entry.source}
                    </p>
                    <p>
                      <strong>Created date: </strong>
                      {entry.created_date}
                    </p>
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

export default Entries;
