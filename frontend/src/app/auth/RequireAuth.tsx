import {Suspense, useContext, useEffect} from "react";
import {Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import {SPARoutes} from "../routes/spa/SPARoutes";
import LoadingPage from "../../widgets/UIPages/LoadingPage/LoadingPage";
import {observer} from "mobx-react-lite";
import {Context} from "../components/RootProviderContainer/RootProviderContainer";
import BFF_Service from "../api/Services/BFF_Service";
import {ErrorResponse} from "../models/ErrorResponse";

const RequireAuth = () => {
    const location = useLocation();
    const {store} = useContext(Context);
    const navigate = useNavigate();
    const from = location.pathname;

    useEffect(() => {
        store.AuthLoadingON();
        BFF_Service.CheckSession()
            .then((res: any) => {
                if (res.status === 200) {
                    store.setAuth(true);
                    store.setUser(res.data);
                    navigate(from, {replace:true});
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
    }, [])


    // console.log('SID:', user?.sid);
    // console.log('isAuth:', isAuth);
    // console.log('isAuth:', store.isAuth);

    return (
        <>
            {store.isAuth === true ? <Suspense fallback={<LoadingPage/>}>
                    <Outlet/>
            </Suspense>
            : <Navigate to={SPARoutes.Common.UNAUTHORIZED} state={{from: location}} replace/>}
        </>
    );

}
export default observer(RequireAuth);