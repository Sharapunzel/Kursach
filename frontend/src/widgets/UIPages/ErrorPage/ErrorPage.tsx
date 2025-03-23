import {Button} from "antd";
import {useContext} from "react";
import {Context} from "../../../app/components/RootProviderContainer/RootProviderContainer";
import {CloseOutlined} from "@ant-design/icons";

function ErrorPage(){
    const {store} = useContext(Context);

    return(
        <div>
            Error Page
            <div>
                {store.errorMessage}
            </div>
            <Button onClick={()=>store.ErrorOFF()}>
                Close Error
            </Button>
        </div>
    )

}
export default ErrorPage;