import { SHOW_ARTICLES, SHOW_DETAILS } from '../actions/get_data';

const initialState = {
    profile: 'articles',
};

const showProfile = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_ARTICLES:
            return Object.assign({}, state, { profile: 'articles' });
        case SHOW_DETAILS:
            return Object.assign({}, state, { profile: 'details' });
        default:
            return state;
    }
};

export default showProfile;
