import http from '../http-common';

class AuthService {
  register(data) {
    return http.post('/auth/signup', data);
  }

  async login(data) {
    const response = await http.post('/auth/signin', data);

    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  }

  logOut() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
