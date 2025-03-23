import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {SPARoutes} from "../../app/routes/spa/SPARoutes";
import {observer} from "mobx-react-lite";
import "./UnauthorizedPage.css";

function UnauthorizedPage(){

    const navigate = useNavigate();

    return(
        <div className={"unauthorized_page"}>
            <div className={"unauthorized_page_container"}>
                <div>
                    You are unauthorized!
                </div>
                <Button type={"primary"} onClick={() => navigate(SPARoutes.Common.LOGIN)}>
                    Go to login page
                </Button>
            </div>
        </div>
    )

}
export default observer(UnauthorizedPage);