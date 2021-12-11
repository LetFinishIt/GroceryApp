import {createStore} from 'redux';
import rootReducer from '../reducers';

// Creation method for axios store, connected to root reducer
export const store = createStore(rootReducer);
