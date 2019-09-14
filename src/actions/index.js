export const SET_DATA = "SET_DATA";

export function setData(data) {
    const action = {
        type: SET_DATA,
        data
    };
    return action;
}