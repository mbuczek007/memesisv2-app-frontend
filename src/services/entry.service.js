import http from '../http-common';
import authHeader from './auth-header';

class EntryDataService {
  createEntry(data) {
    return http.post('/entries/add', data, { headers: authHeader() });
  }

  getAllEntries(status, page, size) {
    const paginationParams = `&page=${page}&size=${size}`;

    if (status) {
      return http.get(`/entries?status=${status + paginationParams}`);
    }

    return http.get('/entries');
  }

  getEntryById(id) {
    return http.get(`/entries/${id}`);
  }

  acceptEntry(id) {
    return http.put(`/entries/accept/${id}`, {}, { headers: authHeader() });
  }

  rejectEntry(id) {
    return http.put(`/entries/reject/${id}`, {}, { headers: authHeader() });
  }

  deleteEntry(id) {
    return http.delete(`/entries/delete/${id}`, { headers: authHeader() });
  }
}

export default new EntryDataService();
