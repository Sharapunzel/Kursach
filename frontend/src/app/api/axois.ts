import axios from 'axios';

const $api =  axios.create({
    baseURL: `${import.meta.env.VITE_BASE_BFF_URL}`,
    withCredentials: true
});

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry){
        originalRequest._isRetry = true;
        try{
            await axios.post<any>(`${import.meta.env.VITE_BASE_BFF_URL}/Logout`, {withCredentials: true});
            window.location.replace(`${import.meta.env.VITE_BASE_BFF_URL}/Login`);
        }
        catch (e){
            console.error(`Error during Logout call:`, e);
            throw e;
        }
    }
    throw error;
});

export default $api;