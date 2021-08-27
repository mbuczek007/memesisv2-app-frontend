import http from '../http-common';

class CommentVoteDataService {
  addVote(data) {
    return http.post('/comment/vote', data);
  }
}

export default new CommentVoteDataService();
