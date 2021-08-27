import http from '../http-common';

class EntryVoteDataService {
  addVote(data) {
    return http.post('/entry/vote', data);
  }
}

export default new EntryVoteDataService();
