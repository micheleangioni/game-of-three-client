import axios from 'axios';

const API_BASE_URL = process.env.API_URL;

export default {

  /**
   * Perform login.
   *
   * @param {string} username
   * @param {string} password
   * @return {AxiosPromise}
   */
  login (username, password) {
    let fullApiUrl = `${API_BASE_URL}sessions`;

    return axios.post(fullApiUrl, {
      username,
      password
    })
  },


  /**
   * Register a new User.
   *
   * @param {string} username
   * @param {string} password
   * @return {AxiosPromise}
   */
  register (username, password) {
    let fullApiUrl = `${API_BASE_URL}users`;

    return axios.post(fullApiUrl, {
      username,
      password
    })
  }
}
