import {combineReducers} from 'redux';
import globalReducer from './globalReducer';

const reducer = combineReducers({
  globalReducer,
});

export default reducer;
