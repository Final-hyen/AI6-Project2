import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookie from 'js-cookie';
import moment from 'moment';

const refresh = async (
    config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
    const refreshToken = Cookie.get('refreshToken');
    const expireAt = localStorage.getItem('expiresAt');
    let token = localStorage.getItem('accessToken');

    // 토큰이 만료되었고, refreshToken 이 저장되어 있을 때
    if (moment(expireAt).diff(moment()) < 0 && refreshToken) {
        axios.defaults.headers.common['Authorization'] = refreshToken;

        // 토큰 갱신 서버통신
        const { data } = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/users/refresh`
        );

        token = data.data.accessToken;
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem(
            'expiresAt',
            moment().add(1, 'hour').format('yyyy-MM-DD HH:mm:ss')
        );
    }

    if (config.headers) config.headers['Authorization'] = `${token}`;

    return config;
};

const refreshErrorHandle = (err: any) => {
    // Cookie.remove('refreshToken');
    console.error('request error', err);
};

export { refresh, refreshErrorHandle };
