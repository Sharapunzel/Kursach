import './index.css';
import {BrowserRouter} from "react-router-dom";
import RootProviderContainer from "./app/components/RootProviderContainer/RootProviderContainer";
import {createRoot} from "react-dom/client";
import React from 'react';

const root = createRoot(
    document.getElementById('root')
);
root.render(
    <BrowserRouter>
        <React.StrictMode>
            <RootProviderContainer/>
        </React.StrictMode>
    </BrowserRouter>
);
