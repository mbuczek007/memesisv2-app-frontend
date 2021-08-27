import React, { useState, createContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddCommentForm from './AddCommentForm';
import Comment from './Comment';
import EntryCommentDataService from '../../../services/entryComment.service';
import styled from '@emotion/styled';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import BestComment from './BestComment';

export const CommentContext = createContext({});

const Comments = ({
  entryId,
  commentsCount,
  hideHeading,
  updateCommentCount,
}) => {
  const [loading, setLoading] = useState(true);
  const [fetchedComments, setFetchedComments] = useState([]);
  const [replying, setReplying] = useState([]);
  const [commentsReloading, setCommentsReloading] = useState(0);

  useEffect(() => {
    const unflatten = (data) => {
      const tree = data
        .map((e) => ({ ...e }))
        .sort((a, b) => a.entry_comment_id - b.entry_comment_id)
        .reduce((a, e) => {
          a[e.entry_comment_id] = a[e.entry_comment_id] || e;
          a[e.parent_comment_id] = a[e.parent_comment_id] || {};
          const parent = a[e.parent_comment_id];
          parent.comments = parent.comments || [];
          parent.comments.push(e);

          return a;
        }, {});
      return Object.values(tree).find((e) => e.entry_comment_id === undefined)
        .comments;
    };

    const fetchComments = () => {
      EntryCommentDataService.getEntryComments(entryId)
        .then((response) => {
          setFetchedComments(unflatten(response.data));
          setLoading(false);

          if (commentsReloading > 0) {
            document
              .getElementById(commentsReloading)
              .scrollIntoView({ behavior: 'smooth' });
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    };

    fetchComments();
  }, [commentsReloading, entryId]);

  const handleCommentsReloading = (newCommentId) => {
    setCommentsReloading(newCommentId);
    updateCommentCount();
  };

  return (
    <StyledPaper id='comments' elevation={0}>
      {!hideHeading && (
        <Typography variant='h6' gutterBottom component='h4'>
          Komentarze ({commentsCount})
        </Typography>
      )}

      <AddCommentForm
        entryId={entryId}
        parentCommentId={null}
        commentsReloading={handleCommentsReloading}
        handleCancelClick={false}
      />
      {loading ? (
        <LoaderWrapper>
          <CircularProgress />
        </LoaderWrapper>
      ) : (
        <>
          {fetchedComments.length !== 0 ? (
            <CommentContext.Provider value={[replying, setReplying]}>
              <BestComment
                comments={fetchedComments}
                commentsReloading={handleCommentsReloading}
              />
              <Typography variant='h6' gutterBottom component='h4'>
                Wszystkie
              </Typography>
              <List>
                {fetchedComments.map((comment, i) => {
                  return (
                    <Comment
                      key={i}
                      comment={comment}
                      commentsReloading={handleCommentsReloading}
                      path={[...[], i]}
                    />
                  );
                })}
              </List>
            </CommentContext.Provider>
          ) : (
            <Typography variant='body2' align='center' component='h4'>
              Brak komentarzy.
            </Typography>
          )}
        </>
      )}
    </StyledPaper>
  );
};

const StyledPaper = styled(Paper)`
  padding: 15px;
`;

const LoaderWrapper = styled.div`
  text-align: center;
`;

export default Comments;
