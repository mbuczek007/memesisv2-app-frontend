import http from '../http-common';

class EntryDataService {
  createEntry(data) {
    return http.post('/entries/add', data);
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
    return http.put(`/entries/accept/${id}`);
  }

  deleteEntry(id) {
    return http.delete(`/entries/delete/${id}`);
  }
}

export default new EntryDataService();
