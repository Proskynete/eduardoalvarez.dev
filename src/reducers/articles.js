import { SHOW_ARTICLES } from '../actions/get_data';

const initialState = {
  articles: [],
};

const showArticles = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ARTICLES:
      return Object.assign({}, state, { articles: action.payload });
    default:
      return state;
  }
};

export default showArticles;
