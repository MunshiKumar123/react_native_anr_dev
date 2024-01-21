import axios from 'axios';
import { getAuthHeaders } from '../service/getAuthHeaders';

export const makeApiRequest = async (apiEndpoint, requestMethod, requestData) => {
    try {
        const headers = await getAuthHeaders();
        const response = await axios({
            method: requestMethod,
            url: apiEndpoint,
            headers,
            data: requestData || undefined,
        });
        return response?.data;

    } catch (error) {
        return error.response;
    }
};