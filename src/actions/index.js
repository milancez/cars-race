export const SET_DATA = "SET_DATA";
export const SET_CARS = "SET_CARS";
export const SET_RACE_CARS = "SET_RACE_CARS";

export function setData(data) {
    const action = {
        type: SET_DATA,
        data
    };
    return action;
}

export function setCars(cars) {
    const action = {
        type: SET_CARS,
        cars
    };
    return action;
}

export function setRaceCars(cars) {
    const action = {
        type: SET_RACE_CARS,
        cars
    };
    return action;
}