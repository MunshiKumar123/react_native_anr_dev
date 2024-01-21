import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer';
import LeadReducer from './reducers/LeadReducer';
import HistoryReducer from './reducers/HistoryReducer';
import MettingReducer from './reducers/MettingReducer';
import FollowupReducer from './reducers/FollowupReducer';
import LeadStatusCountReducer from './reducers/LeadStatusCountReducer';
import StatusReducer from './reducers/StatusReducer';
import StoreLocation from './reducers/StoreLocation';

const store = configureStore({
  reducer: {
    login: loginReducer,
    lead: LeadReducer,
    history: HistoryReducer,
    meeting: MettingReducer,
    followUp: FollowupReducer,
    leadStatus: LeadStatusCountReducer,
    status: StatusReducer,
    location: StoreLocation,
  },
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === 'development'
      ? getDefaultMiddleware({
          serializableCheck: false,
        })
      : getDefaultMiddleware(),
});

export default store;
