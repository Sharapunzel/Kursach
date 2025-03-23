import { createContext, useContext, useEffect, useState, ReactNode, FC } from 'react';
import {AxiosResponse} from "axios/index";
import {useNavigate} from "react-router-dom";
import {ErrorResponse} from "../models/ErrorResponse";
import {Context} from "../components/RootProviderContainer/RootProviderContainer";
import {BFFRoutes} from "../routes/api/BFFRoutes";
import BFF_Service from "../api/Services/BFF_Service";
import {SPARoutes} from "../routes/spa/SPARoutes";

// Define the shape of the BFF context
interface BffContextProps {
    user: UserData | null;
    isAuth: boolean;
    checkSession: () => void;
    login: () => void;
    logout: () => void;
}

// Creating a context for BFF to share state and functions across the application
const BffContext = createContext<BffContextProps>({
    user: null,
    isAuth: false,
    checkSession: () => {},
    login: () => {},
    logout: () => {}
});

interface BffProviderProps {
    baseUrl: string;
    children: ReactNode;
}

export const BffProvider: FC<BffProviderProps> = ({ baseUrl, children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false);

    const {store} = useContext(Context);
    const navigate = useNavigate();

    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }

    const login = () => {
        window.location.replace(`${baseUrl}${BFFRoutes.LOGIN}`);
    };

    const checkSession =  () => {
        store.AuthLoadingON();
        BFF_Service.CheckSession()
            .then((res: any) => {
                if (res.status === 200) {
                    store.setAuth(true);
                    store.setUser(res.data);
                }
            })
            .catch((err) => {
                if (err.response?.data && (err.response.data as ErrorResponse).status && (err.response.data as ErrorResponse).message){
                    const errorResponse:ErrorResponse = err.response.data as ErrorResponse;
                    store.ErrorON(errorResponse.message);
                }
                else{
                    if(err.status !== 401){
                        store.ErrorON(err.toString());
                    }
                }
            })
            .finally(() => {
                store.AuthLoadingOFF();
            })
    };

    // Function to log out the user



    useEffect(() => {
        checkSession();
    }, []);

    return (
        <BffContext.Provider value={{ user, isAuth, checkSession, login, logout }}>
            {children}
        </BffContext.Provider>
    );
};

// Custom hook to use the BFF context easily in other components
export const useBff = (): BffContextProps => useContext(BffContext);

// // Export HOC to provide access to BFF Context
// export const withBff = (Component: React.ComponentType<any>) => (props: any) =>
//     <BffContext.Consumer>
//       {context => <Component {...props} bffContext={context} />}
//     </BffContext.Consumer>;