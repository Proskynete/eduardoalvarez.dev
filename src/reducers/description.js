import { SHOW_DETAILS } from '../actions/get_data';

const initialState = {
    description: {},
};

const showDescription = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_DETAILS:
            return Object.assign({}, state, { description: action.payload });
        default:
            return state;
    }
};

export default showDescription;
