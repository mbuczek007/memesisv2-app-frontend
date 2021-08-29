import React, { useState } from 'react';
import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';
import EntryVoteDataService from '../../services/entryVote.service';
import CommentVoteDataService from '../../services/commentVote.service';
import { useSnackbar } from 'notistack';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { ReactComponent as HeartIcon } from '../../img/red-cross.svg';

const Rating = ({ ratingMode, votes, votesCount, ratedElemId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [loacalVotesCount, setLoacalVotesCount] = useState(votesCount);
  const [loacalVotes, setLoacalVotes] = useState(votes);

  const getCommentMode = () => {
    return ratingMode === 'comment';
  };

  const handleVoteClick = (mode) => {
    setLoading(true);

    if (getCommentMode()) {
      CommentVoteDataService.addVote({
        entry_comment_id: ratedElemId,
        vote_mode: mode,
      })
        .then((response) => {
          setLoading(false);
          setLoacalVotesCount(loacalVotesCount + 1);
          setLoacalVotes(mode ? loacalVotes + 1 : loacalVotes - 1);
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
          enqueueSnackbar(e.response.data.message, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
        });
    } else {
      EntryVoteDataService.addVote({ entry_id: ratedElemId })
        .then((response) => {
          setLoading(false);
          setLoacalVotesCount(votesCount + 1);
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
          enqueueSnackbar(e.response.data.message, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          });
        });
    }
  };

  return (
    <VotesActtionPanel>
      {getCommentMode() && (
        <VoteStatus>
          {loacalVotes > 0 ? '+' + loacalVotes : loacalVotes}/ (
          {loacalVotesCount})
        </VoteStatus>
      )}

      <VotingIcon
        voteaction='plus'
        onClick={() => handleVoteClick(true)}
        disabled={loading}
      >
        {getCommentMode() ? (
          <ThumbUpIcon fontSize={'small'} />
        ) : (
          <HeartIconWrapper>
            <HeartIcon />
            <VotesResult>
              {loacalVotesCount === 0 ? '0' : '+' + loacalVotesCount}
            </VotesResult>
          </HeartIconWrapper>
        )}
      </VotingIcon>

      {getCommentMode() && (
        <VotingIcon
          voteaction='down'
          onClick={() => handleVoteClick(false)}
          disabled={loading}
        >
          <ThumbDownIcon fontSize={'small'} />
        </VotingIcon>
      )}
    </VotesActtionPanel>
  );
};

const VotesActtionPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  position: relative;
`;

const VotingIcon = styled(IconButton)`
  padding: 0;

  ${({ voteaction, theme }) =>
    voteaction &&
    `
    color: ${voteaction === 'plus' ? `#4caf50` : theme.palette.secondary.main};
  `}
`;

const VoteStatus = styled.div`
  text-align: right;
  margin-bottom: 5px;
  flex-basis: 100%;
  font-size: 12px;

  span {
    font-weight: 700;
  }
`;

const HeartIconWrapper = styled.span`
  display: flex;
  align-items: center;

  &:hover {
    svg {
      fill: #fda92d;
      filter: drop-shadow(0px 0px 3px rgba(253, 169, 45, 0.3));
    }
  }

  svg {
    width: 26px;
    height: 26px;
    fill: red;
    transition: fill 0.4s ease, filter 0.4s ease;
  }
`;

const VotesResult = styled.div`
  font-size: 14px;
  color: #637381;
  font-weight: 700;
  margin-left: 10px;
`;

export default Rating;
