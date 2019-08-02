import {createAction, handleActions} from 'redux-actions';
import {fromJS, List} from 'immutable';
import { create } from 'domain';

const ADD_TEXT = 'ADD_TEXT';
const CLEAR_TEXT = 'CLEAR_TEXT';
const UPDATE_CONNECTION = 'UPDATE_CONNECTION';

export const addText = createAction(ADD_TEXT, (text, location) => {
    return {text : text, location : location};
})

export const clearText = createAction(CLEAR_TEXT, () => {
    return null;
})

export const updateConnection = createAction(UPDATE_CONNECTION,  (connection) => {
    return {connection};
})

const initialState = {
    logs : [],
    result : [],
    connection : false
}

export default handleActions({
    [ADD_TEXT] : (state, {payload : newLog}) => {
        return state.update('logs', log => {
            var prevLog;
            if(log.size > 10){
                prevLog = log.delete(0);
            }else{
                prevLog = log;
            }
            return prevLog.push(newLog);
        });
    },
    [CLEAR_TEXT] : (state, action) => {
        return state.set('logs', List([]));
    },
    [UPDATE_CONNECTION] : (state, {payload : {connection}}) => {
        return state.set('connection', connection);
    }
}, fromJS(initialState));