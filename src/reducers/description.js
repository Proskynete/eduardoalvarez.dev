import { SHOW_DESCRIPTION } from '../actions/show_description';
import { SHOW_POSTS } from '../actions/show_posts';

const initialState = {
  profile: 'listPosts',
};

const showDescription = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_POSTS:
      return Object.assign({}, state, { profile: 'listPosts' });
    case SHOW_DESCRIPTION:
      return Object.assign({}, state, { profile: 'description' });
    default:
      return state;
  }
};

export default showDescription;
