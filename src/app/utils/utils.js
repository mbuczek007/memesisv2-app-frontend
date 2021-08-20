import getVideoId from 'get-video-id';

export const getVideoIdFromUrl = (value) => {
  const video = getVideoId(value);

  return video.id;
};
