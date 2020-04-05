import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { homeReducer, whoIAmReducer, blogReducer } from '@Reducers/';

const rootReducer = combineReducers({
	homeData: homeReducer,
	whoIAmData: whoIAmReducer,
	blogData: blogReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
