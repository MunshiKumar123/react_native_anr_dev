import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, LOGIN } from '../../../service/api'
import { makeApiRequest } from '../../../service/makeApiRequest';
const initialState = {
  email: '',
  password: '',
  users: {},
};

/// Fetch Data-----
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data) => {
    return makeApiRequest(`${BASEURL}${LOGIN}`, 'post', data);
  }
);

const loginSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    FormData: (state, action) => {
      const { prop, value } = action.payload;
      state[prop] = value;
    },
    getUser: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { FormData, getUser } = loginSlice.actions;
export default loginSlice.reducer;
