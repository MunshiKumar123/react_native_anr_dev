import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, GETLEAD, CREATE_LEAD, UPDATE_LEAD, DELETE_LEAD, USERLIST, GET_STATUS } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest'

const initialState = {
    lead_Name: "",
    fullName: "",
    Owner: "",
    email: "",
    phone: "",
    lead_status: "",
    leadGetData: [],
    userLists: [],
};

// Fetch Data According to pagination
export const LeadGetApi = createAsyncThunk(
    "products/fetchProducts",
    async (page) => {
        return makeApiRequest(`${BASEURL}${GETLEAD}${'?page='}${page}`, 'get');
    }
);

// creatd
export const LeadCreateApi = createAsyncThunk(
    "products/fetchProducts",
    async (data) => {
        return makeApiRequest(`${BASEURL}${CREATE_LEAD}`, 'post', data);
    }
);

// update
export const LeadUpdateApi = createAsyncThunk(
    "products/fetchProducts",
    async ({ data, uuid }) => {
        return makeApiRequest(`${BASEURL}${UPDATE_LEAD}${uuid}`, 'put', data);
    }
);

// delete
export const LeadDeleteApi = createAsyncThunk(
    "products/fetchProducts",
    async (leadDeleteID) => {
        return makeApiRequest(`${BASEURL}${DELETE_LEAD}${leadDeleteID}`, 'delete');
    }
);

// dataGet UserList
export const UserListGetApi = createAsyncThunk(
    "UserList",
    async () => {
        return makeApiRequest(`${BASEURL}${USERLIST}`, 'get');
    }
);

//  Get status
export const StatusGetApi = createAsyncThunk(
    "status",
    async () => {
        return makeApiRequest(`${BASEURL}${GET_STATUS}`, 'get');
    }
);


const LeadSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        LeadFormData: (state, action) => {
            const { prop, value } = action.payload;
            state[prop] = value;
        },
    },
    extraReducers: (builder) => {
        builder.
            addCase(LeadGetApi.fulfilled, (state, action) => {
                state.leadGetData = action.payload;
            })
            .addCase(UserListGetApi.fulfilled, (state, action) => {
                state.userLists = action.payload;
            })
    },
});
export const { LeadFormData } = LeadSlice.actions;
export default LeadSlice.reducer;
