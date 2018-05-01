import { SHOW_POSTS, SHOW_DETAILS } from '../actions/get_data';

const initialState = {
  profile: 'posts',
};

const showProfile = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_POSTS:
      return Object.assign({}, state, { profile: 'posts' });
    case SHOW_DETAILS:
      return Object.assign({}, state, { profile: 'details' });
    default:
      return state;
  }
};

export default showProfile;
