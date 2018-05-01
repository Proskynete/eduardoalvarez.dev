import { combineReducers } from 'redux';
import showPosts from './posts';
import showProfile from './profile';
import showDescription from './description';

const rootReducer = combineReducers({
  posts: showPosts,
  profile: showProfile,
  description: showDescription,
});

export default rootReducer;
