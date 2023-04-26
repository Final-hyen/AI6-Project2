import axios from 'axios';
import Cookie from 'js-cookie';
import moment from 'moment';

export default function setAuthorizationToken(
    accessToken: string,
    refreshToken: string
) {
    if (accessToken && refreshToken) {
        axios.defaults.headers.common['Authorization'] = `${accessToken}`;

        localStorage.setItem(
            'expiresAt',
            moment().add(1, 'hour').format('yyyy-MM-DD HH:mm:ss')
        );
        localStorage.setItem('accessToken', accessToken);
        Cookie.set('refreshToken', refreshToken);
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}
