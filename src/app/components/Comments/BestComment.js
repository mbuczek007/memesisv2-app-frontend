import React from 'react';
import Comment from './Comment';
import Typography from '@mui/material/Typography';

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
    <div>
      <Typography variant='h6' gutterBottom component='h4'>
        Najlepszy Komentarz
      </Typography>
      <Comment
        comment={bestComment}
        commentsReloading={commentsReloading}
        path={[...[], 999999]}
      />
    </div>
  );
};

export default BestComment;
