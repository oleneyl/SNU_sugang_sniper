import {createAction, handleActions} from 'redux-actions';
import {fromJS, List} from 'immutable';
import { create } from 'domain';

const ADD_TEXT = 'ADD_TEXT';
const CLEAR_TEXT = 'CLEAR_TEXT';

export const addText = createAction(ADD_TEXT, (text, location) => {
    return {text : text, location : location};
})

export const clearText = createAction(CLEAR_TEXT, () => {
    return null;
})

const initialState = {
    logs : [],
    result : []
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
    }
}, fromJS(initialState));