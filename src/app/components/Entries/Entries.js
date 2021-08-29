import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import EntryDataService from '../../../services/entry.service';
import Grid from '@material-ui/core/Grid';
import PageTitle from '../shared/PageTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import Entry from './Entry';

const Entries = ({ status }) => {
  const itemsPerPage = 10;
  let history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [totalEntryPages, setTotalEntryPages] = useState(0);
  const { page, viewEntryId } = useParams();
  const pageInt = page ? parseInt(page) : 1;
  const [changeEntriesCount, setChangeEntriesCount] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (!viewEntryId) {
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
    } else {
      EntryDataService.getEntryById(viewEntryId)
        .then((response) => {
          setEntries([response.data]);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          setEntries([]);
        });
    }
  }, [status, pageInt, changeEntriesCount, viewEntryId]);

  const generatePageTitle = () => {
    let title = '';

    if (status === 'accepted') {
      title = 'Główna';
    } else if (status === 'pending') {
      title = 'W kolejce';
    } else if (viewEntryId) {
      title = entries.length && entries[0].title;
    }

    return title;
  };

  const handleChangeEntriesCount = (value) => {
    setChangeEntriesCount(value);
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
                <Entry
                  viewMode={viewEntryId}
                  key={entry.entry_id}
                  entry={entry}
                  changeEntriesCount={changeEntriesCount}
                  handleChangeEntriesCount={handleChangeEntriesCount}
                />
              ))}

              {!viewEntryId && (
                <StyledPagination
                  count={totalEntryPages}
                  page={pageInt}
                  color='primary'
                  shape='rounded'
                  variant='outlined'
                  onChange={handlePageChange}
                />
              )}
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

const StyledPagination = styled(Pagination)`
  > ul {
    justify-content: center;
  }
`;

export default Entries;
