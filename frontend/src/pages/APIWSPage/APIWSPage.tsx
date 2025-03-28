import {observer} from "mobx-react-lite";
import APIWSSocketsComponent from "./APIWSSocketsComponent";
import APIWSRegularComponent from "./APIWSRegularComponent";
import "./APIWSPage.css";

function APIWSPage(){

    const tags = ["tag1", "tag2", "tag3", "tag4"];

    return(
        <div className={"apiws_page"}>
            <div className={"apiws_page_header"}>
                API WebSockets Page (Weather Forecast)
            </div>
            <div className={"apiws_page_sections"}>
                <div className={"apiws_page_section"}>
                    <div className={"apiws_page_section_header"}>
                        Sockets Section
                    </div>
                    <div className={"apiws_page_section_component"}>
                        {tags.map(tag => {
                            return <APIWSSocketsComponent tag={tag} key={`socketscomp${tag}`}/>
                        })}
                    </div>
                </div>
                <div className={"apiws_page_section"}>
                    <div className={"apiws_page_section_header"}>
                        Regular Http Section
                    </div>
                    <div className={"apiws_page_section_component"}>
                        {tags.map(tag => {
                            return <APIWSRegularComponent key={`regularcomp${tag}`}/>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )

}
export default observer(APIWSPage);