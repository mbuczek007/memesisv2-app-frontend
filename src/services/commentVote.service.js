import http from '../http-common';
import authHeader from './auth-header';

class CommentVoteDataService {
  addVote(data) {
    return http.post('/comment/vote', data, { headers: authHeader() });
  }
}

export default new CommentVoteDataService();
