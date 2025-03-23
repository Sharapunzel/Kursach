import {AxiosResponse} from "axios";
import $api from "../axois";
import {APIRoutes} from "../../routes/api/APIRoutes";

export default class API_Service{
    static async GetWeather():Promise<AxiosResponse<WeatherForecast>>{
        return $api.get<WeatherForecast>(`${APIRoutes.GET_WEATHER}`);
    }
    static async GetWeather2():Promise<AxiosResponse<WeatherForecast>>{
        return $api.get<WeatherForecast>(`${APIRoutes.GET_WEATHER2}`);
    }
}