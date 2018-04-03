import { SHOW_POSTS } from '../actions/show_posts';

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
