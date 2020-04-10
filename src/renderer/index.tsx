import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import UrlMapping from "../components/UrlMapping/UrlMapping";
import themes from "../themes";

import "./style.css";

["dragenter", "dragover", "drop"].forEach((ev) => {
    window.addEventListener(ev, (event) => {
        const e = event as DragEvent;
        e.preventDefault();
        e.dataTransfer!.effectAllowed = "none";
        e.dataTransfer!.dropEffect = "none";
    });
});

ReactDOM.render(
    <HashRouter>
        <MuiThemeProvider theme={themes.blue}>
            <CssBaseline />
            <UrlMapping />
        </MuiThemeProvider>
    </HashRouter>,
    document.querySelector("#app")
);
