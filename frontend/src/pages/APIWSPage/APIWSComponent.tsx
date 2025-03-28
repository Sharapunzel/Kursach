import {observer} from "mobx-react-lite";
import { useState } from "react";
import useFetch from "../../shared/hooks/UseFetch";
import APIWS_Service from "../../app/api/Services/APIWS_Service";
import { WeatherForecast } from "../../app/models/API_Response";

function APIWSComponent(){

    const [data, setData] = useState<WeatherForecast>();

    useFetch(APIWS_Service.GetWeather, setData);

    return(
        <div>
            <div>
                API WS Component
            </div>
            <div>
                {data?.temperatureC}
            </div>
        </div>
    )

}
export default observer(APIWSComponent);