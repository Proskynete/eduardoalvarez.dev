import axios from 'axios';
import config from '../config/config';

const SHOW_POSTS = 'SHOW_POSTS';

const context = config.getUrl();

const showPosts = () =>
  (dispatch) => {
    const url = `${context}${config.getEntryPointApi()}`;
    axios.get(url)
      .then((response) => {
        dispatch({
          type: SHOW_POSTS,
          payload: response.data.posts,
        });
      });
  };
export {
  SHOW_POSTS,
  showPosts,
};
