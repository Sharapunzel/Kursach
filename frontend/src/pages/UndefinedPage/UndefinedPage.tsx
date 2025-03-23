import {observer} from "mobx-react-lite";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {SPARoutes} from "../../app/routes/spa/SPARoutes";
import "./UndefinedPage.css";

function UndefinedPage(){

    const navigate = useNavigate();

    return(
        <div className={"undefined_page"}>
            <div className={"undefined_page_container"}>
                <div>
                    Страница не найдена! 404 :)
                </div>
                <div>
                    <Button onClick={()=>{navigate(SPARoutes.Private.HOME)}}>На главную</Button>
                </div>
            </div>
        </div>
    )

}
export default observer(UndefinedPage);