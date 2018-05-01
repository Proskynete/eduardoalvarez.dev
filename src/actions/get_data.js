import axios from 'axios';
import config from '../config/config';

const SHOW_POSTS = 'SHOW_POSTS';
const SHOW_DETAILS = 'SHOW_DETAILS';

const context = config.getUrl();

const showData = (id = false) =>
  (dispatch) => {
    const uri = id || '';
    const url = `${context}${config.getEntryPointApi()}${uri}`;
    axios.get(url)
      .then((response) => {
        const type = id ? SHOW_DETAILS : SHOW_POSTS;
        dispatch({
          type,
          payload: response.data.posts,
        });
      });
  };

export {
  SHOW_POSTS,
  SHOW_DETAILS,
  showData,
};
