import {observer} from "mobx-react-lite";
import "./Footer.css";

function Footer(){

    return(
        <footer className={"footer_container"}>
            <div>
                PSU @2025
            </div>
        </footer>
    )

}
export default observer(Footer);