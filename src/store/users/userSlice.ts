import { createSlice } from '@reduxjs/toolkit';
import { UserDetails } from '../../models/user';

interface InitialState {
  user?: UserDetails;
}

const initialState: InitialState = {};

export const userSlice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    saveUserData: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveUserData } = userSlice.actions;

export default userSlice.reducer;
