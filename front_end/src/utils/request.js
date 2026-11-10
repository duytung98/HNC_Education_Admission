import axios from 'axios';
import { request } from '~/configs';
import { jwtDecode } from 'jwt-decode';

export const requestYHN = axios.create({
    baseURL: request.apiUrlBaseYHN,
    timeout: 10000
});

export const requestHNC = axios.create({
    baseURL: request.apiUrlBaseHNC,
    timeout: 10000
});

export const createAxios = (user, dispatch, actionCreatorSuccess) => {
    const newInstance = axios.create({
        timeout: 10000
    });
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwtDecode(user?.access_token);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken(user?.refresh_token);
                const refreshUser = {
                    fullname: data?.fullname,
                    access_token: data?.access_token,
                    refresh_token: data?.refresh_token
                };
                dispatch(actionCreatorSuccess(refreshUser));
                config.headers.Authorization = "Bearer " + data.access_token;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    return newInstance;
};

const refreshToken = async (refresh_token) => {
    try {
        const url = request?.apiRefreshToken;
        const res = await axios.post(url, {}, {
            headers: {
                Authorization: 'Bearer ' + refresh_token,
                timeout: 10000
            }
        });
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const getYHN = async (url, option = {}) => {
    const res = await requestYHN.get(url, option);
    return res.data;
}

export const getHNC = async (url, option = {}) => {
    const res = await requestHNC.get(url, option);
    return res.data;
}


export const post = async (url, data, option = null) => {
    const res = await requestHNC.post(url, data, option);
    return res.data;
}