import {Button} from "antd";
import {useContext} from "react";
import {Context} from "../../../app/components/RootProviderContainer/RootProviderContainer";
import {CloseOutlined} from "@ant-design/icons";
import "./ErrorPage.css";

function ErrorPage(){
    const {store} = useContext(Context);

    return(
        <div className={"error_page"}>
            <div className="error_page_container">
                <div className={"error_page_header"}>
                    <div>
                        Ошибка
                    </div>
                    <div>
                        <Button onClick={()=>store.ErrorOFF()} icon={<CloseOutlined/>}/>
                    </div>
                </div>
                <div className={"error_page_info"}>
                    {store.errorMessage}
                </div>
            </div>
        </div>
    )

}
export default ErrorPage;