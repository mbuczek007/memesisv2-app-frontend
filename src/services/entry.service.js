import http from '../http-common';

class EntryDataService {
  createEntry(data) {
    return http.post('/entries/add', data);
  }

  getAllEntries(status) {
    if (status) {
      return http.get(`/entries?status=${status}`);
    }

    return http.get('/entries');
  }

  getEntryById(id) {
    return http.get(`/entries/${id}`);
  }

  updateAcceptances(id, data) {
    return http.put(`/entries/updateAcceptances/${id}`, data);
  }

  deleteEntry(id) {
    return http.delete(`/entries/delete/${id}`);
  }
}

export default new EntryDataService();
