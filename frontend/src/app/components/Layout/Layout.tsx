import {Suspense, useContext, useEffect} from "react";
import {Context} from "../RootProviderContainer/RootProviderContainer";
import {SkeletonTheme} from "react-loading-skeleton";
import App from "../App";
import LoadingPage from "../../../widgets/UIPages/LoadingPage/LoadingPage";
import ErrorPage from "../../../widgets/UIPages/ErrorPage/ErrorPage";
import {observer} from "mobx-react-lite";


function Layout(){
    const {store} = useContext(Context);

    async function refresh() {
        await store.checkAuth()
    }

    useEffect(() => {
        refresh()
    }, [])

    return(
        <div className={"root_layout"}>
            <header>
                <div>Хедер</div>
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