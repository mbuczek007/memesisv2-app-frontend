import React, { useState, forwardRef } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import YouTube from 'react-youtube';
import moment from 'moment';
import 'moment/locale/pl';
import Rating from '../Rating';
import Comments from '../Comments/Comments';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import Paper from '@mui/material/Paper';
import EntryDataService from '../../../services/entry.service';
import Typography from '@mui/material/Typography';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardLink from '../shared/CardLink';
import Avatar from '@mui/material/Avatar';
import CommentIcon from '@mui/icons-material/Comment';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import Stack from '@mui/material/Stack';
import { stringAvatar } from '../../utils/utils';
import Link from '@mui/material/Link';
import { HashLink as RouterLink } from 'react-router-hash-link';

const options = ['Zgłoś'];

const Entry = ({
  viewMode,
  entry,
  handleChangeEntriesCount,
  changeEntriesCount,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [entryCommentsCount, setEntryCommentsCount] = useState(
    entry.comments_count
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleDeleteEntry = (entryId) => {
    EntryDataService.deleteEntry(entryId)
      .then((response) => {
        handleChangeEntriesCount(!changeEntriesCount);
        enqueueSnackbar(response.data.message, { variant: 'success' });
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      });
  };

  const handleAcceptEntry = (entryId) => {
    EntryDataService.acceptEntry(entryId)
      .then((response) => {
        handleChangeEntriesCount(!changeEntriesCount);
        enqueueSnackbar(response.data.message, { variant: 'success' });
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      });
  };

  const handleRejectEntry = (entryId) => {
    EntryDataService.rejectEntry(entryId)
      .then((response) => {
        handleChangeEntriesCount(!changeEntriesCount);
        enqueueSnackbar(response.data.message, { variant: 'success' });
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      });
  };

  const handleUpdateCommentCount = () => {
    setEntryCommentsCount(entryCommentsCount + 1);
  };

  const getVideoIdFromSource = (source) => {
    return source.split('-')[2];
  };

  const ytOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <>
      <StyledMuiCard>
        <EntryContent
          direction='row'
          justifyContent='space-between'
          alignItems='flex-start'
        >
          <div>
            <Stack direction='row' alignItems='center' spacing={1}>
              <Avatar
                {...stringAvatar(
                  entry.user_name ? entry.user_name : 'Uzytkownik usunięty'
                )}
              />
              <div>
                <NickName variant='body2'>
                  {entry.user_name ? entry.user_name : 'Uzytkownik usunięty'}
                </NickName>
                <StyledDate component='span' variant='body2'>
                  <ScheduleIcon style={{ fontSize: 12 }} />
                  {moment(entry.createdAt).fromNow()}
                </StyledDate>
              </div>
            </Stack>
          </div>
          <div>
            <IconButton
              aria-label='more'
              aria-controls='long-menu'
              aria-haspopup='true'
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id='long-menu'
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                style: {
                  width: '20ch',
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === 'Pyxis'}
                  onClick={() => setAnchorEl(null)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </EntryContent>
        <ImageWrapper>
          {entry.source_type === 'yt-video' && (
            <VideoWrapper>
              <YouTube
                videoId={getVideoIdFromSource(entry.source)}
                opts={ytOpts}
              />
            </VideoWrapper>
          )}
          <>
            {viewMode ? (
              <img
                src={process.env.REACT_APP_ENTRY_UPLOAD_PATH + entry.source}
                alt={entry.title}
              />
            ) : (
              <CardLink linked={!viewMode} entryId={entry.entry_id}>
                <img
                  src={process.env.REACT_APP_ENTRY_UPLOAD_PATH + entry.source}
                  alt={entry.title}
                />
              </CardLink>
            )}
          </>
        </ImageWrapper>
        <EntryFooter
          direction='row'
          justifyContent='space-between'
          alignItems='flex-start'
        >
          <Stack
            direction='row'
            justifyContent='flex-start'
            alignItems='center'
            spacing={1}
          >
            <Rating
              ratedElemId={entry.entry_id}
              votesCount={entry.votes_count}
            />
            {!entry.disable_comments ? (
              <CommentLink
                underline='none'
                component={RouterLink}
                to={`/view/${entry.entry_id}#comments`}
              >
                <CommentIcon fontSize='medium' />
                <CommentsCount>
                  {entryCommentsCount === 0 ? '0' : entryCommentsCount}
                </CommentsCount>
              </CommentLink>
            ) : (
              <Button>
                <StyledSpeakerNotesOffIcon fontSize='medium' />
              </Button>
            )}
          </Stack>
        </EntryFooter>
        {entry.source_info && (
          <Source variant='body1'>Źródło: {entry.source_info}</Source>
        )}
        {/* {!entry.is_accepted ? (
          <Button
            onClick={() => handleAcceptEntry(entry.entry_id)}
            variant='contained'
            color='primary'
            startIcon={<SaveIcon />}
          >
            Accept
          </Button>
        ) : (
          <Button
            onClick={() => handleRejectEntry(entry.entry_id)}
            variant='contained'
            color='primary'
            startIcon={<SaveIcon />}
          >
            Przenieś do poczekalni
          </Button>
        )}
        <Button
          onClick={() => handleDeleteEntry(entry.entry_id)}
          variant='contained'
          color='secondary'
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button> */}
      </StyledMuiCard>
      {viewMode && (
        <>
          {!entry.disable_comments && (
            <Comments
              entryId={entry.entry_id}
              commentsCount={entryCommentsCount}
              updateCommentCount={handleUpdateCommentCount}
            />
          )}
        </>
      )}
    </>
  );
};

const CommentsCount = styled.span`
  font-size: 17px;
  margin-left: 8px;
`;

const CommentLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #a1a5ae;
`;

const StyledMuiCard = styled(Paper)`
  padding: 25px 0 5px;
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  background: #fff;
  box-shadow: rgb(145 158 171 / 24%) 0px 0px 2px 0px,
    rgb(145 158 171 / 24%) 0px 16px 32px -4px;

  img {
    width: 100%;
    height: auto;
  }
`;

const EntryContent = styled(Stack)`
  margin: 0 30px;
`;

const EntryFooter = styled(EntryContent)`
  padding: 20px 0;
  border-top: 1px solid #f3f3f3;
`;

const VideoWrapper = styled.div`
  position: absolute;
  width: 91.5%;
  top: 31px;
  left: 30px;
  padding-bottom: 68.5%;
  height: 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const StyledDate = styled(Typography)`
  color: #9fa3ac;
  display: block;
  margin-top: -2px;

  svg {
    position: relative;
    top: 2px;
    margin-right: 4px;
  }
`;

const NickName = styled(Typography)`
  font-weight: 700;
`;

const Source = styled(Typography)`
  text-align: center;
  font-size: 12px;
  color: #8e8e8e;
  margin-top: 5px;
`;

const StyledSpeakerNotesOffIcon = styled(SpeakerNotesOffIcon)`
  color: #637381;
  opacity: 0.6;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

export default Entry;
