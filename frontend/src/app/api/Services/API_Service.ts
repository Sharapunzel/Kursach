import {AxiosResponse} from "axios";
import $api from "../axois";
import {APIRoutes} from "../../routes/api/APIRoutes";
import { WeatherForecast } from "../../models/API_Response";

export default class API_Service{
    static async GetWeather():Promise<AxiosResponse<WeatherForecast>>{
        return $api.get<WeatherForecast>(`${APIRoutes.GET_WEATHER}`);
    }
    static async GetWeather2():Promise<AxiosResponse<WeatherForecast>>{
        return $api.get<WeatherForecast>(`${APIRoutes.GET_WEATHER2}`);
    }
}