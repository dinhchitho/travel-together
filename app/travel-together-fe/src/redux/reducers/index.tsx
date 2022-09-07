import { combineReducers } from 'redux';
import { NotificationReducer } from './notificationReducer';
import { UserReducer } from './userReducer';

const rootReducer = combineReducers({
  userReducer: UserReducer,
  notificationReducer: NotificationReducer
  //some more reducer will come
});

export type ApplicationState = ReturnType<typeof rootReducer>;
export { rootReducer };