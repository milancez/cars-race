import { combineReducers } from 'redux';

import {
    SET_DATA,
    SET_CARS,
    SET_RACE_CARS
} from '../actions';

function getData(state = [], action) {
    switch (action.type) {
      case SET_DATA:
        return action.data;
      default:
        return state;
    }
}

function getCars(state = [], action) {
    switch (action.type) {
      case SET_CARS:
        return action.cars;
      default:
        return state;
    }
}

function getRaceCars(state = [], action) {
  switch (action.type) {
    case SET_RACE_CARS:
      return action.cars;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
    getData,
    getCars,
    getRaceCars
});

export default rootReducer;