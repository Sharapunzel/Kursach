import {AxiosResponse} from "axios";
import $api from "../axois";
import {BFFRoutes} from "../../routes/api/BFFRoutes";

export default class BFF_Service{

    static async Logout():Promise<AxiosResponse<any>>{
        return $api.post<any>(`${BFFRoutes.LOGOUT}`);
    }

    static async CheckSession():Promise<AxiosResponse<UserData>>{
        return $api.get<UserData>(`${BFFRoutes.CHECK_SESSION}`);
    }

}