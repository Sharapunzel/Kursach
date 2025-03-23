import {Button} from "antd";
import {useContext} from "react";
import {Context} from "../../app/components/RootProviderContainer/RootProviderContainer";
import {observer} from "mobx-react-lite";
import {useBff} from "../../app/auth/BffProvider";

function LoginPage(){

    const {store} = useContext(Context);

    return(
        <div>

            <Button onClick={store.login}>
                Login Button
            </Button>
        </div>
    )
}
export default observer(LoginPage);