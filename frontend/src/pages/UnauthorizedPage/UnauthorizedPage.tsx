import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {SPARoutes} from "../../app/routes/spa/SPARoutes";
import {observer} from "mobx-react-lite";

function UnauthorizedPage(){

    const navigate = useNavigate();

    return(
        <div>
            <div>
                You are unauthorized!
            </div>
            <Button onClick={() => navigate(SPARoutes.Common.LOGIN)}>
                Go to login page
            </Button>
        </div>
    )

}
export default observer(UnauthorizedPage);