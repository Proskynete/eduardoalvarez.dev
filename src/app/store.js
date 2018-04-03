import { combineReducers, createStore } from 'redux';
import showPosts from '../reducers/posts';

/* eslint-disable */
const devTools = typeof __REDUX_DEVTOOLS_EXTENSION__ === 'function' && __REDUX_DEVTOOLS_EXTENSION__() || undefined;
/* eslint-enable */

export default () => createStore(combineReducers({
  showPosts,
}), {}, devTools);
