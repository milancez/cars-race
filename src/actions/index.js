export const SET_DATA = "SET_DATA";
export const SET_CARS = "SET_CARS";

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