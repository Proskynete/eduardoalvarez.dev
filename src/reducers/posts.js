import { SHOW_POSTS } from '../actions/get_data';

const initialState = {
  posts: [],
};

const showPosts = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_POSTS:
      return Object.assign({}, state, { posts: action.payload });
    default:
      return state;
  }
};

export default showPosts;
