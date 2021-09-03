import http from '../http-common';
import authHeader from './auth-header';

class EntryCommentDataService {
  createComment(data) {
    return http.post('/comments/add', data, { headers: authHeader() });
  }

  getEntryComments(entryId) {
    return http.get(`/comments/${entryId}`);
  }
}

export default new EntryCommentDataService();
