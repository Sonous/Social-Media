import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/UserSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
