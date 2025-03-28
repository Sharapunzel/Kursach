import { HubConnectionBuilder } from "@microsoft/signalr";
import {useEffect} from "react";

function useHub(
    hubUrl: string,
    hubMethodForListening: string,
    dataSetter: any,
    params: string
){
    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .build();

        const establishConnection = async () => {
            try{
                await connection.start();

                connection.on(hubMethodForListening, (data: any) => [
                    dataSetter(data)
                ])

                connection.invoke("Subscribe", params);
                console.log("subscr")
            }
            catch (e) {
                console.log(e);
            }
        }

        establishConnection();

        return () => {
            const clearConnection = async () => {
                await connection.invoke("Unsubscribe", params);
                await connection.stop();
                console.log("unsubscr")
            }
            clearConnection();
        }

    }, [])
}
export default useHub;