import {observer} from "mobx-react-lite";
import { useState } from "react";
import { APIWSRoutes } from "../../app/routes/api/APIWSRoutes";
import useHub from "../../shared/hooks/UseHub";
import "./APIWSPage.css";

function APIWSSocketsComponent({tag}:{tag: string}){

    const [dataws, setDataws] = useState<any>();

    useHub(APIWSRoutes.LIVE_HUB, "RecieveTagUpdate", setDataws, tag);

    return(
        <div className="sockets_component">
            <div className="sockets_component_header">
                Sockests Component
            </div>
            <div className="sockets_component_section">
                <div>
                    {tag}
                </div>
                <div>
                    {dataws && dataws}
                </div>
            </div>
        </div>
    )

}
export default observer(APIWSSocketsComponent);