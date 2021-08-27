import http from '../http-common';

class EntryCommentDataService {
  createComment(data) {
    return http.post('/comments/add', data);
  }

  getEntryComments(entryId) {
    return http.get(`/comments/${entryId}`);
  }
}

export default new EntryCommentDataService();
