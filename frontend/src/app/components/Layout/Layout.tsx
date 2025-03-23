import {Suspense, useContext} from "react";
import {Context} from "../RootProviderContainer/RootProviderContainer";
import {SkeletonTheme} from "react-loading-skeleton";
import App from "../App";
import LoadingPage from "../../../widgets/UIPages/LoadingPage/LoadingPage";
import ErrorPage from "../../../widgets/UIPages/ErrorPage/ErrorPage";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import Header from "../../../widgets/Header/Header";
import Footer from "../../../widgets/Footer/Footer";
import "./Layout.css";


function Layout(){
    const {store} = useContext(Context);
    const navigate = useNavigate();

    return(
        <div className={"root_layout"}>
            <Header/>
            <div className="root_layout_page_container">
                <div className="root_layout_page">
                    {(store.isDataLoading || store.isAuthLoading) && <LoadingPage/>}
                    {store.isError && <ErrorPage/>}
                    <Suspense fallback={<LoadingPage/>}>
                        <SkeletonTheme height={30}>
                            <App/>
                        </SkeletonTheme>
                    </Suspense>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
export default observer(Layout);