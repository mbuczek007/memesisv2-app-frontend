import http from '../http-common';

class EntryDataService {
  createEntry(data) {
    return http.post('/entries/add', data);
  }

  getAllEntries() {
    return http.get('/entries');
  }

  getEntryById(id) {
    return http.get(`/entries/${id}`);
  }

  getAllAcceptedEntries() {
    return http.get('/entries?status=accepted');
  }

  getAllPendingEntries() {
    return http.get('/entries?status=pending');
  }

  updateAcceptances(id, data) {
    return http.put(`/entries/updateAcceptances/${id}`, data);
  }

  deleteEntry(id) {
    return http.delete(`/entries/delete/${id}`);
  }
}

export default new EntryDataService();
