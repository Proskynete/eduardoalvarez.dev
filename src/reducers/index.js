import { combineReducers } from 'redux';
import showPosts from './posts';
import showProfile from './profile';

const rootReducer = combineReducers({
  posts: showPosts,
  profile: showProfile,
});

export default rootReducer;
