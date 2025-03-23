import {Suspense, useContext, useEffect} from "react";
import {Context} from "../RootProviderContainer/RootProviderContainer";
import {SkeletonTheme} from "react-loading-skeleton";
import App from "../App";
import LoadingPage from "../../../widgets/UIPages/LoadingPage/LoadingPage";
import ErrorPage from "../../../widgets/UIPages/ErrorPage/ErrorPage";
import {observer} from "mobx-react-lite";
import {SPARoutes} from "../../routes/spa/SPARoutes";
import {useNavigate} from "react-router-dom";
import {Button} from "antd";


function Layout(){
    const {store} = useContext(Context);
    const navigate = useNavigate();

    return(
        <div className={"root_layout"}>
            <header>
                <div>Хедер</div>
                <Button onClick={() => {navigate(SPARoutes.Private.HOME)}}>Go Home</Button>
                <div>
                    <div>Login state:</div>
                    <div>{store.isAuth === true ? "true" : "false"}</div>
                </div>
            </header>
            <div className="root_layout_page_container">
                {(store.isDataLoading || store.isAuthLoading) && <LoadingPage/>}
                {store.isError && <ErrorPage/>}
                <div className="root_layout_page">
                    <Suspense fallback={<LoadingPage/>}>
                        <SkeletonTheme height={30}>
                            <App/>
                        </SkeletonTheme>
                    </Suspense>
                </div>
            </div>
            <footer>
                Футер
            </footer>
        </div>
    )
}
export default observer(Layout);