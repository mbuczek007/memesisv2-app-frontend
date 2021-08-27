import React from 'react';
import Comment from './Comment';
import Typography from '@material-ui/core/Typography';
import styled from '@emotion/styled';

const BestComment = ({ comments, commentsReloading }) => {
  const pullBestComment = () => {
    const deepCopyComments = JSON.parse(JSON.stringify(comments));

    return deepCopyComments.sort((a, b) => {
      const aVotes = a.votes_up_count - a.votes_down_count;
      const bVotes = b.votes_up_count - b.votes_down_count;
      return parseFloat(bVotes) - parseFloat(aVotes);
    })[0];
  };

  const bestComment = pullBestComment();

  if (bestComment.votes_count < 5) {
    return null;
  }

  return (
    <BestCommentWrapper>
      <Typography variant='h6' gutterBottom component='h4'>
        Najlepszy Komentarz
      </Typography>
      <Comment
        comment={bestComment}
        commentsReloading={commentsReloading}
        path={[...[], 999999]}
      />
    </BestCommentWrapper>
  );
};

const BestCommentWrapper = styled.div`
  margin-bottom: 20px;
`;

export default BestComment;
