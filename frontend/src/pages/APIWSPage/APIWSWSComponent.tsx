import {observer} from "mobx-react-lite";
import { useState } from "react";
import { APIWSRoutes } from "../../app/routes/api/APIWSRoutes";
import useHub from "../../shared/hooks/UseHub";

function APIWSWSComponent(){

    const [dataws, setDataws] = useState<any>();

    useHub(APIWSRoutes.LIVE_HUB, "RecieveTagUpdate", setDataws, "tagName1");

    return(
        <div>
            <div>
                API WS WS Component
            </div>
            <div>
                {dataws && dataws}
            </div>
        </div>
    )

}
export default observer(APIWSWSComponent);