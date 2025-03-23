import {AxiosResponse} from "axios";
import {useContext, useEffect} from "react";
import {Context} from "../../app/components/RootProviderContainer/RootProviderContainer";
import {ErrorResponse} from "../../app/models/ErrorResponse";

function useFetch(
    APICall:(params?: any) => Promise<AxiosResponse<any | ErrorResponse, any>>,
    dataSetter: any,
    params?: any,
    dependecies: any[] = [],
    ownLoadingStateHandler?: (state: boolean) => void,
    interval?: number
){
    const {store} = useContext(Context);

    useEffect(() => {

        const fetchData = () => {
            if(ownLoadingStateHandler) ownLoadingStateHandler(true);
            else store.DataLoadingON();

            APICall(params)
                .then((res: any) => {
                    dataSetter(res.data as any)
                })
                .catch((err) => {
                    if (err.response?.data && (err.response.data as ErrorResponse).status && (err.response.data as ErrorResponse).message){
                        const errorResponse:ErrorResponse = err.response.data as ErrorResponse;
                        store.ErrorON(errorResponse.message);
                    }
                    else{
                        store.ErrorON();
                    }
                })
                .finally(() => {
                    if (ownLoadingStateHandler) ownLoadingStateHandler(false);
                    else store.DataLoadingOFF();
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