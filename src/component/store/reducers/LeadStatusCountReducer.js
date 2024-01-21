import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, STATUS_COUNT } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest';

const initialState = {
    status: [],
};


// Fetch Data According to pagination
export const LeadStatusGetApi = createAsyncThunk(
    "products/fetchProducts",
    async () => {
        return makeApiRequest(`${BASEURL}${STATUS_COUNT}`, 'get');
    }
);

const StatusLeadSlice = createSlice({
    name: 'status',
    initialState,
    extraReducers: (builder) => {
        builder.
            addCase(LeadStatusGetApi.fulfilled, (state, action) => {
                state.status = action.payload;
            })
    },
});
export default StatusLeadSlice.reducer;
