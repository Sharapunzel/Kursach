import {HashLoader} from "react-spinners";
import "./LoadingPage.css";

function LoadingPage(){
    return(
        <div className={"loading_page"}>
            <HashLoader size={40} loading={true} color={"#64F86A"}/>
        </div>
    )
}
export default LoadingPage;