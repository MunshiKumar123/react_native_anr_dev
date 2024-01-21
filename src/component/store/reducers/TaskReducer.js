import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASEURL, CREATE_TASK, GET_TASK, UPDATE_TASK } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest';

const initialState = {
    task: [],
};

// get data task

export const TaskGetApi = createAsyncThunk(
    "Meeting",
    async (page) => {
        return makeApiRequest(`${BASEURL}${GET_TASK}${'?page='}${page}`, 'get');
    }
);

// task create api
export const createTaskApi = createAsyncThunk(
    "products/fetchProducts",
    async (data) => {
        return makeApiRequest(`${BASEURL}${CREATE_TASK}`, 'post', data);
    }
);

// task update

export const TaskUpdateApi = createAsyncThunk(
    "task/update",
    async ({ data, uuid }) => {
        return makeApiRequest(`${BASEURL}${UPDATE_TASK}${uuid}`, 'put', data);
    }
);

const TaskSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        TaskFormData: (state, action) => {
            const { prop, value } = action.payload;
            state[prop] = value;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(TaskGetApi.fulfilled, (state, action) => {
            state.task = action.payload;
        });
    },
});
export const { TaskFormData } = TaskSlice.actions;
export default TaskSlice.reducer;