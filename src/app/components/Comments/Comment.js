import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { CommentContext } from './Comments';
import AddCommentForm from './AddCommentForm';
import moment from 'moment';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Rating from '../Rating';
import { useSelector } from 'react-redux';

const Comment = ({ comment, commentsReloading, path }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [replying, setReplying] = useContext(CommentContext);
  const [showReply, setShowReply] = useState(false);

  const compare = (a1, a2) => {
    return JSON.stringify(a1) === JSON.stringify(a2);
  };

  const handleCommentsReloading = (newCommentId) => {
    setReplying([]);
    setShowReply(true);
    commentsReloading(newCommentId);
  };

  const handleCancelReply = () => {
    return compare(replying, path) ? setReplying([]) : setReplying(path);
  };

  return (
    <StyledListItem isfirstlevel={comment.parent_comment_id}>
      <ScrollCommentAnchor id={comment.entry_comment_id}></ScrollCommentAnchor>
      <StyledAvatar>{comment.user_name.charAt(0).toUpperCase()}</StyledAvatar>
      <ListItemText
        primary={
          <>
            <UserName component='span' variant='subtitle1'>
              {comment.user_name}
            </UserName>
            <StyledDate component='span' variant='body2'>
              <ScheduleIcon style={{ fontSize: 12 }} />
              {moment(comment.createdAt).fromNow()}
            </StyledDate>
          </>
        }
        secondary={comment.comment}
      />

      <Rating
        ratingMode='comment'
        ratedElemId={comment.entry_comment_id}
        votesCount={comment.votes_count}
        votes={comment.votes_up_count - comment.votes_down_count}
      />

      <CommentActions>
        {comment.comments && (
          <ActionLinkReply
            isshowreply={showReply ? 1 : 0}
            component='button'
            variant='body2'
            color='primary'
            onClick={() => {
              setShowReply(!showReply);
            }}
          >
            {!showReply ? (
              <>
                <KeyboardArrowDownIcon />
                Pokaz odpowiedzi ({comment.comments.length})
              </>
            ) : (
              <>
                <KeyboardArrowUpIcon />
                Ukryj odpowiedzi ({comment.comments.length})
              </>
            )}
          </ActionLinkReply>
        )}

        <>
          {!compare(replying, path) && isLoggedIn && (
            <ActionLink
              component='button'
              variant='body2'
              color='primary'
              onClick={handleCancelReply}
            >
              Odpowiedz
            </ActionLink>
          )}

          {compare(replying, path) && (
            <AddCommentForm
              entryId={comment.entry_id}
              parentCommentId={comment.entry_comment_id}
              commentsReloading={handleCommentsReloading}
              handleCancelClick={handleCancelReply}
            />
          )}
        </>
      </CommentActions>
      {comment.comments && showReply && (
        <StyledList>
          {comment.comments.map((comment, i) => {
            return (
              <Comment
                key={i}
                comment={comment}
                commentsReloading={commentsReloading}
                path={[...[...path], i]}
              />
            );
          })}
        </StyledList>
      )}
    </StyledListItem>
  );
};

const ScrollCommentAnchor = styled.span`
  position: absolute;
  top: -100px;
`;

const StyledListItem = styled(ListItem)`
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-start;
  padding-right: 0;
  border-top: 1px solid #ccc;
  padding-top: 15px;

  ${({ isfirstlevel }) =>
    isfirstlevel &&
    `
      padding-left: 20px;

  `}

  > ul {
    flex-basis: 100%;
  }

  .MuiListItemText-secondary {
    color: #000;
    margin: 8px 0 10px;
    font-size: 14px;
  }
`;

const CommentActions = styled.div`
  flex-basis: 100%;
  margin-left: 45px;
`;

const UserName = styled(Typography)`
  font-weight: 700;
  color: #595959;
  padding-right: 5px;
`;

const StyledDate = styled(Typography)`
  color: #a1a1a1;

  svg {
    position: relative;
    top: 1px;
    margin-right: 2px;
  }
`;

const StyledList = styled(List)`
  padding: 0;
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 8px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActionLinkReply = styled(ActionLink)`
  ${({ isshowreply }) =>
    isshowreply &&
    `
      font-weight: 700;

  `}
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 10px;
`;

export default Comment;
