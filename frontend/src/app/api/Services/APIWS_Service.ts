import {AxiosResponse} from "axios";
import $api from "../axois";
import {WeatherForecast} from "../../models/API_Response";
import { APIWSRoutes } from "../../routes/api/APIWSRoutes";

export default class APIWS_Service{
    static async GetWeather():Promise<AxiosResponse<WeatherForecast>>{
        return $api.get<WeatherForecast>(`${APIWSRoutes.GET_WEATHER}`);
    }
    static async GetWeather2():Promise<AxiosResponse<WeatherForecast>>{
        return $api.get<WeatherForecast>(`${APIWSRoutes.GET_WEATHER2}`);
    }
}