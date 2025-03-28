import {observer} from "mobx-react-lite";
import { useState } from "react";
import useFetch from "../../shared/hooks/UseFetch";
import APIWS_Service from "../../app/api/Services/APIWS_Service";
import { WeatherForecast } from "../../app/models/API_Response";
import "./APIWSPage.css";

function APIWSRegularComponent(){

    const [data, setData] = useState<WeatherForecast>();

    useFetch(APIWS_Service.GetWeather, setData);

    return(
        <div className={"regular_component"}>
            <div className={"regular_component_header"}>
                Regular Weather Forecast
            </div>
            <div className={"regular_component_section"}>
                <div>
                    {data?.temperatureC}
                </div>
                <div>
                    {data?.temperatureF}
                </div>
                <div>
                    {data?.date}
                </div>
                <div>
                    {data?.summary}
                </div>
            </div>
        </div>
    )

}
export default observer(APIWSRegularComponent);