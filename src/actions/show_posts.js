import axios from 'axios';
import context from '../config/config';

const SHOW_POSTS = 'SHOW_POSTS';

const showPosts = () =>
  (dispatch) => {
    const url = context.links.api;
    axios.get(url)
      .then((response) => {
        dispatch({
          type: SHOW_POSTS,
          payload: response.data.response.posts,
        });
      });
  };

export {
  SHOW_POSTS,
  showPosts,
};
