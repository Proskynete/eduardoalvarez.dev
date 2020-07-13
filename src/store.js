import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
	homeReducer,
	aboutMeReducer,
	blogReducer,
	userReducer,
	articleReducer,
	notificationReducer,
} from '@Reducers/';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
	homeData: homeReducer,
	aboutMeData: aboutMeReducer,
	blogData: blogReducer,
	userData: userReducer,
	articleData: articleReducer,
	notification: notificationReducer,
});

const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk)),
);
export default store;
