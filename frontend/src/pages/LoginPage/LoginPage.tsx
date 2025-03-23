import {Button} from "antd";
import {useContext} from "react";
import {Context} from "../../app/components/RootProviderContainer/RootProviderContainer";
import {observer} from "mobx-react-lite";
import "./LoginPage.css";
import {LoginOutlined} from "@ant-design/icons";

function LoginPage(){

    const {store} = useContext(Context);

    return(
        <div className={"login_page"}>
            <div className={"login_page_container"}>
                <div>
                    Login Page (redirecting to Keycloak)
                </div>
                <Button type={"primary"} onClick={store.login} iconPosition={"end"} icon={<LoginOutlined/>}>
                    Login Button
                </Button>
            </div>
        </div>
    )
}
export default observer(LoginPage);