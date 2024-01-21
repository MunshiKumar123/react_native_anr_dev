import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, CREATE_METTING_ACTIVITY, GET_METTING, UPDATE_METTING } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest';

const initialState = {
    meeting: [],
};


// Fetch Data According to pagination

export const MettingGetApi = createAsyncThunk(
    "Meeting",
    async (page) => {
        return makeApiRequest(`${BASEURL}${GET_METTING}${'?page='}${page}`, 'get');
    }
);


// Meeting Create
export const createMettingApi = createAsyncThunk(
    "products/fetchProducts",
    async (data) => {
        return makeApiRequest(`${BASEURL}${CREATE_METTING_ACTIVITY}`, 'post', data);
    }
);

// update
export const updateMeetingApi = createAsyncThunk(
    "products/fetchProducts",
    async ({ data, uuid }) => {
        return makeApiRequest(`${BASEURL}${UPDATE_METTING}${uuid}`, 'put', data);
    }
);


const MeetingSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        MeetingFormData: (state, action) => {
            const { prop, value } = action.payload;
            state[prop] = value;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(MettingGetApi.fulfilled, (state, action) => {
            state.meeting = action.payload;
        });
    },
});
export const { MeetingFormData } = MeetingSlice.actions;
export default MeetingSlice.reducer;