import {Route, Routes} from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import {SPARoutes} from "../routes/spa/SPARoutes";
import LoginPage from "../../pages/LoginPage/LoginPage";
import UnauthorizedPage from "../../pages/UnauthorizedPage/UnauthorizedPage";
import UndefinedPage from "../../pages/UndefinedPage/UndefinedPage";
import {lazy} from "react";
import {observer} from "mobx-react-lite";

const HomePageLazy = lazy(() => import("../../pages/HomePage/HomePage"))
const APIPageLazy = lazy(() => import("../../pages/APIPage/APIPage"))
const APIWSPageLazy = lazy(() => import("../../pages/APIWSPage/APIWSPage.tsx"))


function App(){

    return(
        <Routes>
            <Route element={<RequireAuth/>}>
                <Route index path={SPARoutes.Private.HOME} element={<HomePageLazy/>}/>
                <Route path={SPARoutes.Private.API_PAGE} element={<APIPageLazy/>}/>
                <Route path={SPARoutes.Private.API_WS_PAGE} element={<APIWSPageLazy/>}/>
            </Route>

            <Route path={SPARoutes.Common.LOGIN} element={<LoginPage/>}/>
            <Route path={SPARoutes.Common.UNAUTHORIZED} element={<UnauthorizedPage/>}/>
            <Route path={"*"} element={<UndefinedPage/>}/>
        </Routes>
    )
}
export default observer(App);