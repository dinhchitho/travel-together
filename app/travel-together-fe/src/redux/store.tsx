   
import { createStore, applyMiddleware, Dispatch } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers'; // root reducer

const store = createStore(rootReducer, applyMiddleware(thunk));

export { store };

