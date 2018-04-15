import { combineReducers } from 'redux';
import showPosts from './posts';

const rootReducer = combineReducers({
  posts: showPosts,
});

export default rootReducer;
