import { combineReducers } from 'redux';
import showArticles from './articles';
import showProfile from './profile';
import showDescription from './description';

const rootReducer = combineReducers({
    articles: showArticles,
    profile: showProfile,
    description: showDescription,
});

export default rootReducer;
