import Store from "../../store/store";
import {createContext, Suspense, useContext} from "react";
import {ConfigProvider} from "antd";
import Layout from "../Layout/Layout";
import {BffProvider} from "../../auth/BffProvider";


interface IStore{
    store: Store;
}

const store = new Store;

export const Context = createContext<IStore>({store});


function RootProviderContainer(){

    const {store} = useContext(Context);

    return(
        <Context.Provider value={{store}}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#64F86A",
                        borderRadius: 5,
                        lineWidth: 2,
                        colorInfo: "#1eff14",
                        colorLink: "#1eff14",

                        colorBgContainer: "#fff"
                    }
                }}
            >
                <Layout/>
            </ConfigProvider>
        </Context.Provider>
    )

}
export default RootProviderContainer;