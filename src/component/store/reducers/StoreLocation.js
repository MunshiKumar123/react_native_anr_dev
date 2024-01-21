import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, LOCATION_GET, LOCATION_SEND, LOCATION_USER_WISE } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest';

const initialState = {
    location: [],
    userLocation: [],
};

// Send longitude and latitude
export const LocationApi = createAsyncThunk(
    "location/send",
    async (data) => {
        return makeApiRequest(`${BASEURL}${LOCATION_SEND}`, 'post', data);
    }
);

// Get location
export const LocationGetApi = createAsyncThunk(
    "location/get",
    async () => {
        return makeApiRequest(`${BASEURL}${LOCATION_GET}`, 'get');
    }
);

// get location wise user
export const LocationGetUserApi = createAsyncThunk(
    "location/send",
    async (data) => {
        return makeApiRequest(`${BASEURL}${LOCATION_USER_WISE}`, 'post', data);
    }
);


const LocationSlice = createSlice({
    name: 'location',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(LocationGetApi.fulfilled, (state, action) => {
                state.location = action.payload;
            })
            .addCase(LocationGetUserApi.fulfilled, (state, action) => {
                state.userLocation = action.payload;
            })
    },
});

export default LocationSlice.reducer;
