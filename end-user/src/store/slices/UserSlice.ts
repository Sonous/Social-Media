import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';



const initialState: User = {
    id: '',
    name: '',
    username: '',
    email: '',
    avatar_url: '',
    bio: '',
    // created_at: '',
    // updated_at: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            // console.log(action)

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
