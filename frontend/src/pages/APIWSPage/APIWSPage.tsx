import {observer} from "mobx-react-lite";
import APIWSComponent from "./APIWSComponent";
import APIWSWSComponent from "./APIWSWSComponent";

function APIWSPage(){

    

    return(
        <div>
            <div>
                API WS Page
            </div>
            <div>
                <APIWSWSComponent/>
                <APIWSWSComponent/>
                <APIWSWSComponent/>
            </div>
            <div>
                <APIWSComponent/>
            </div>
            
        </div>
    )

}
export default observer(APIWSPage);