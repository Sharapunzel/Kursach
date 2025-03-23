import {AxiosResponse} from "axios";
import {useContext, useEffect} from "react";
import {Context} from "../../app/components/RootProviderContainer/RootProviderContainer";
import {ErrorResponse} from "../../app/models/ErrorResponse";
import {SPARoutes} from "../../app/routes/spa/SPARoutes";
import {useNavigate} from "react-router-dom";

function useFetch(
    APICall:(params?: any) => Promise<AxiosResponse<any | ErrorResponse, any>>,
    dataSetter: any,
    params?: any,
    dependecies: any[] = [],
    ownLoadingStateHandler?: (state: boolean) => void,
    interval?: number,
    forCheckingSession?: boolean
){
    const {store} = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = () => {
            if(ownLoadingStateHandler) ownLoadingStateHandler(true);
            else store.DataLoadingON();

            APICall(params)
                .then((res: any) => {
                    if (res.status === 200) {
                        if (forCheckingSession === true){
                            store.setAuth(true);
                            store.setLogout(false);
                        }
                        dataSetter(res.data as any)
                    } else if (res.status === 401) {
                        navigate(SPARoutes.Common.UNAUTHORIZED);
                    }
                })
                .catch((err) => {
                    if (err.response?.data && (err.response.data as ErrorResponse).status && (err.response.data as ErrorResponse).message){
                        const errorResponse:ErrorResponse = err.response.data as ErrorResponse;
                        store.ErrorON(errorResponse.message);
                    }
                    else{
                        store.ErrorON(err.toString());
                    }
                })
                .finally(() => {
                    if (ownLoadingStateHandler) ownLoadingStateHandler(false);
                    else store.DataLoadingOFF();
                    store.ErrorOFF()
                })
        }

        fetchData()

        if(interval){
            const intervalId = setInterval(fetchData, interval);

            return () => clearInterval(intervalId);
        }

    }, [...dependecies])
}
export default useFetch;