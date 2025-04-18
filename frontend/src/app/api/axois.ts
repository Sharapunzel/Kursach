import axios from 'axios';

const $api =  axios.create({
    baseURL: `${import.meta.env.VITE_BASE_BFF_URL}`,
    withCredentials: true
});

export default $api;