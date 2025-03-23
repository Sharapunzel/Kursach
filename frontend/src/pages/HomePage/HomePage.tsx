import {useContext, useRef, useState} from "react";
import {Context} from "../../app/components/RootProviderContainer/RootProviderContainer";
import {observer} from "mobx-react-lite";
import "./HomePage.css";
import useFetch from "../../shared/hooks/UseFetch";
import BFF_Service from "../../app/api/Services/BFF_Service";
import {Button} from "antd";
import {CopyOutlined} from "@ant-design/icons";

function HomePage(){

    const {store} = useContext(Context);
    const [token, setToken] = useState<GetToken>();
    const tokenRef = useRef<any>(null);

    const copyToClipboard = () => {
        const text = tokenRef.current.innerText;
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Токен скопирован!');
            })
            .catch(() => {
                alert('Не удалось скопировать токен!');
            });
    };

    useFetch(BFF_Service.GetToken, setToken);

    return(
        <div className={"home_container"}>
            <div className={"home_info_container"}>
                <div className={"home_info_header"}>
                    User Claims
                </div>
                <div className={"home_info_claims"}>
                    {Object.entries(store.user).map(([claim, value]) => (
                        <div key={claim} className={"home_user_claims"}>
                            <div className={"home_user_claim"}>{claim}:</div>
                            <div className={"home_user_value"}>{String(value)}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={"home_info_container"}>
                <div className={"home_info_header"}>
                    <div>
                        Token from BFF (User Session)
                    </div>
                    <div>
                        <Button onClick={copyToClipboard} icon={<CopyOutlined/>}/>
                    </div>
                </div>
                <div ref={tokenRef} className={"home_info_token"}>
                    {token?.token}
                </div>
            </div>
        </div>
    )

}
export default observer(HomePage);