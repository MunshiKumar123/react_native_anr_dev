import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASEURL, CREATE_DEAL, GET_DEAL } from '../../../service/api';
import { makeApiRequest } from '../../../service/makeApiRequest';




// deal data get according to pagination

export const dealGetApi = createAsyncThunk(
    "deal",
    async (page) => {
        return makeApiRequest(`${BASEURL}${GET_DEAL}${'?page='}${page}`, 'get');
    }
);


// deal create
export const createDealApi = createAsyncThunk(
    "deal/deal",
    async (data) => {
        return makeApiRequest(`${BASEURL}${CREATE_DEAL}`, 'post', data);
    }
);