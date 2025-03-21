import axios, { Method, AxiosResponse } from 'axios';
import { config } from '../config/config';

interface RequestConfig {
    method: Method;    // HTTP method (e.g., 'GET', 'POST', etc.)
    url: string;       // API endpoint URL
    data?: unknown;        // request body
    headers?: Record<string, string>;  // headers
    params?: Record<string, string>;  // params
}

export const getAuthToken = (): string | null => {
    return window.localStorage.getItem('accessToken');
};

axios.defaults.baseURL = config.apiUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = async <T = unknown>({ method, url, data, headers, params }: RequestConfig): Promise<AxiosResponse<T>> => {
    const accessToken = getAuthToken();
    const defaultHeaders: Record<string, string> = {};

    if (accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
        defaultHeaders.Authorization = `Bearer ${accessToken}`;
    }

    try {
        const response = await axios({
            method,
            url,
            headers: { ...defaultHeaders, ...headers },
            data,
            params: params
        });
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};