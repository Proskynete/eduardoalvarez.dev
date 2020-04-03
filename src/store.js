import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { homeReducer } from '@Reducers/';

const rootReducer = combineReducers({
	homeData: homeReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
