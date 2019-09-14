import { combineReducers } from 'redux';

import {
    SET_DATA
} from '../actions';

function getData(state = [], action) {
    switch (action.type) {
      case SET_DATA:
        return action.data;
      default:
        return state;
    }
}

const rootReducer = combineReducers({
    getData
});

export default rootReducer;