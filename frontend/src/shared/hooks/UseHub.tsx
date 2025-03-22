import {useEffect} from "react";

function useHub(
    hubUrl: string,
    hubMethodForListening: string,
    dataSetter: any,
    params: string
){
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.None)
            .build();

        const establichConnection = async () => {
            try{
                await connection.start();

                connection.on(hubMethodForListening, (data) => [
                    dataSetter(data)
                ])

                connection.invoke("Subscribe", params);
            }
            catch (e) {
                console.log(e);
            }
        }

        establichConnection();

        return () => {
            const clearConnection = async () => {
                await connection.invoke("Unsubscribe", params);
                await connection.stop();
            }
            clearConnection();
        }

    }, [])
}
export default useHub;