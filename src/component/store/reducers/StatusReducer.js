import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, GET_STATUS } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest'

const initialState = {
    status: [],
};


//  Get status
export const StatusGetApi = createAsyncThunk(
    "status",
    async () => {
        return makeApiRequest(`${BASEURL}${GET_STATUS}`, 'get');
    }
);


const StatusSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder.
            addCase(StatusGetApi.fulfilled, (state, action) => {
                state.status = action.payload;
            })
    },
});
export default StatusSlice.reducer;
