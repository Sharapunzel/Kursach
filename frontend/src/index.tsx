import './index.css';
import {BrowserRouter} from "react-router-dom";
import RootProviderContainer from "./app/components/RootProviderContainer/RootProviderContainer";
import {createRoot} from "react-dom/client";


const root = createRoot(
    document.getElementById('root')
);
root.render(
    <BrowserRouter>
        <RootProviderContainer/>
    </BrowserRouter>
);
