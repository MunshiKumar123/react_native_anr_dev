import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, FOLLOWUPS_CREATE, FOLLOWUPS_GET, FOLLOWUPS_UPDATE } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest';



// followups create
export const FollowupCreateApi = createAsyncThunk(
    "followups",
    async (data) => {
        return makeApiRequest(`${BASEURL}${FOLLOWUPS_CREATE}`, 'post', data);
    }
);

// followups update
export const FollowupUpdateApi = createAsyncThunk(
    "followups",
    async ({ data, uuid }) => {
        return makeApiRequest(`${BASEURL}${FOLLOWUPS_UPDATE}${uuid}`, 'put', data);
    }
);

// followups get
const initialState = {
    loader: true,
    followUpList: [],
};

export const FollowupGetApi = createAsyncThunk(
    "Followup",
    async (uuid) => {
        return makeApiRequest(`${BASEURL}${FOLLOWUPS_GET}${uuid}`, 'get');
    }
)

const FollowupSlice = createSlice({
    name: 'Followup',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(FollowupGetApi.pending, (state) => {
            // Set loader to true when the request is pending
            state.loader = true;
        });
        builder.
            addCase(FollowupGetApi.fulfilled, (state, action) => {
                state.loader = false;
                state.followUpList = action.payload;
            })
    },
});
export default FollowupSlice.reducer;