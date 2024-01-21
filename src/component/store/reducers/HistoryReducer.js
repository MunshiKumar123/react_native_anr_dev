import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, HISTORY_GET } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest';

const initialState = {
    history: [],
};


/// Fetch Data-----

export const HistoryGetApi = createAsyncThunk(
    "products/fetchProducts",
    async (uuid) => {
        return makeApiRequest(`${BASEURL}${HISTORY_GET}${uuid}`, 'get');
    }
);

const HistorySlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        LeadFormData: (state, action) => {
            const { prop, value } = action.payload;
            state[prop] = value;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(HistoryGetApi.fulfilled, (state, action) => {
                state.history = action.payload;
            });
    },
});
export const { LeadFormData } = HistorySlice.actions;
export default HistorySlice.reducer;
