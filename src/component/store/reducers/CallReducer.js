import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASEURL, CREATE_CALL_DATA, GET_CALL_DATA } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest'

// creatd
export const CreateCallApi = createAsyncThunk(
    "call",
    async (data) => {
        return makeApiRequest(`${BASEURL}${CREATE_CALL_DATA}`, 'post', data);
    }
);

// data get
export const CallGetApi = createAsyncThunk(
    "call",
    async (page) => {
        return makeApiRequest(`${BASEURL}${GET_CALL_DATA}${'?page='}${page}`, 'get');
    }
);
