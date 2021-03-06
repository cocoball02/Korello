import axios from 'axios';

import { setAccessToken } from './index';
const serverUrl = 'https://hyuki.app/api/v1';
const postData = async (uri, body) => {
  try {
    setAccessToken(localStorage.getItem('accessToken'));

    let { data } = await axios.post(serverUrl + uri, body);
    return [data.result_body ? data.result_body : null, data.result_code, null];
  } catch (err) {
    console.log(err);
    return [null, err.response.data.result_code, err];
  }
};

export default postData;
