// reducers/userReducer.js
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASEURL, LOGOUT } from '../../../service/api';
import { getAuthHeaders } from '../../../service/getAuthHeaders';


/// LOGOUT

export const LogoutApi = createAsyncThunk(
    "logout",
    async () => {
        try {
            const headers = await getAuthHeaders();
            const resp = await axios.post(`${BASEURL}${LOGOUT}`, null, { headers });
            return resp?.data;
        } catch (error) {
            console.log(error);
        }
    }
);

