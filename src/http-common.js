import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_PATH,
  headers: {
    'Content-type': 'application/json',
  },
});
