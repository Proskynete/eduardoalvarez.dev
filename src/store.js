import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { homeReducer, whoIAmReducer } from '@Reducers/';

const rootReducer = combineReducers({
	homeData: homeReducer,
	whoIAmData: whoIAmReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
