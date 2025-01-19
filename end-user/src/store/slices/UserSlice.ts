import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
}

const initialState: User = {
    id: '',
    firstName: '',
    lastName: '',
    age: 0,
    email: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            return action.payload;
        },

        clearUser: () => {
            return initialState;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
