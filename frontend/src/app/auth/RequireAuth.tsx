import {useContext, Suspense} from "react";
import {Context} from "../components/RootProviderContainer/RootProviderContainer";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {SPARoutes} from "../routes/spa/SPARoutes";
import LoadingPage from "../../widgets/UIPages/LoadingPage/LoadingPage";
import {observer} from "mobx-react-lite";

function RequireAuth(){

    const {store} = useContext(Context);
    const location = useLocation();

    return (
        <>
            {store.isAuth === true ? <Suspense fallback={<LoadingPage/>}>
                    <Outlet/>
            </Suspense>
            : <Navigate to={SPARoutes.Common.LOGIN} state={{from: location}} replace/>}
        </>
    );

}
export default observer(RequireAuth);