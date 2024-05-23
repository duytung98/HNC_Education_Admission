import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.user = {
                full_name: action.payload?.fullname,
                access_token: action.payload?.access_token,
                refresh_token: action.payload?.refresh_token
            };
        },
        logOutSuccess: state => {
            state.user = null;
        },
        extraReducers: (builder) => {
            builder.addCase('auth/PURGE', (state) => {
                state.user = null;
            });
        }
    },
});

export const { loginSuccess, logOutSuccess } = authSlice.actions;
export default authSlice.reducer;
