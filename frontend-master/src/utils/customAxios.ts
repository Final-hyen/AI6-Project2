import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Cookie from 'js-cookie';
import { refresh, refreshErrorHandle } from './refresh';

const customAxios: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL, // 기본 서버 주소 입력
});

const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL, // 기본 서버 주소 입력
    timeout: 3000,
    params: {},
});

api.interceptors.request.use(
    async (
        config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
        const refreshToken = Cookie.get('refreshToken');
        let token = localStorage.getItem('accessToken');

        const isLogin = config.url?.includes('login');

        if (!isLogin && !token) window.location.replace('/');
        if (!isLogin && !refreshToken) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            Cookie.remove('refreshToken');
            window.location.replace('/sign-in');
        }

        return config;
    },
    (error) => {
        alert(error.response?.data.errorMessage);
        throw error;
    }
);
api.interceptors.request.use(refresh, refreshErrorHandle);
api.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => {
        alert(error.response?.data.errorMessage);
        throw error;
    }
);

export { customAxios, api };
