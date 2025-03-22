import {useContext} from "react";
import {Context} from "../../app/components/RootProviderContainer/RootProviderContainer";
import {observer} from "mobx-react-lite";

function HomePage(){

    const {store} = useContext(Context);

    return(
        <div>
            {Object.entries(store.user).map(([claim, value]) => (
                <div key={claim}>
                    <strong>{claim}</strong>: {String(value)}
                </div>
            ))}
        </div>
    )

}
export default observer(HomePage);