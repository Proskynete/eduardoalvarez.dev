import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { homeReducer, aboutMeReducer, blogReducer } from '@Reducers/';

const rootReducer = combineReducers({
	homeData: homeReducer,
	aboutMeData: aboutMeReducer,
	blogData: blogReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
