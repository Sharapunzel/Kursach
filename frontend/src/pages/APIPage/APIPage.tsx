import {observer} from "mobx-react-lite";
import {useState} from "react";
import useFetch from "../../shared/hooks/UseFetch";
import API_Service from "../../app/api/Services/API_Service";
import "./APIPage.css";
import { WeatherForecast } from "../../app/models/API_Response";

function APIPage(){

    const [data, setData] = useState<WeatherForecast>();
    const [data2, setData2] = useState<WeatherForecast>();

    useFetch(API_Service.GetWeather, setData);
    useFetch(API_Service.GetWeather2, setData2);
    
    return(
        <div className={"api_page"}>
            <div className={"api_page_header"}>
                API Page (Weather Forecast)
            </div>
            <div className={"api_page_cards"}>
                {data && <div className={"api_page_card"}>
                    <div className={"api_page_card_header"}>
                        GetWeather 1
                    </div>
                    <div>{data?.date}</div>
                    <div>{data?.summary}</div>
                    <div>{data?.temperatureC}</div>
                    <div>{data?.temperatureF}</div>
                </div>}

                {data2 && <div className={"api_page_card"}>
                    <div className={"api_page_card_header"}>
                        GetWeather 2
                    </div>
                    <div>{data2?.date}</div>
                    <div>{data2?.summary}</div>
                    <div>{data2?.temperatureC}</div>
                    <div>{data2?.temperatureF}</div>
                </div>}
            </div>
        </div>
    )

}
export default observer(APIPage);