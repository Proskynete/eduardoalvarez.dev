import { combineReducers } from 'redux';
import showPosts from './posts';
import showDescription from './description';

const rootReducer = combineReducers({
  posts: showPosts,
  profile: showDescription,
});

export default rootReducer;
