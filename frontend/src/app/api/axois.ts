import axios from 'axios';
import {SPARoutes} from "../routes/spa/SPARoutes";
import BFF_Service from "./Services/BFF_Service";

const $api =  axios.create({
    baseURL: `${import.meta.env.VITE_BASE_BFF_URL}`,
    withCredentials: true
});

export default $api;