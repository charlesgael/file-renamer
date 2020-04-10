import { createMuiTheme, Theme, ThemeOptions } from "@material-ui/core";
import assign from "object-assign-deep";
import blue from "./blue";
import defaults from "./defaults";

function m<T extends { [k: string]: ThemeOptions }>(themesConfig: T): { [k in keyof T & string]: Theme } {
    return Object.keys(themesConfig).reduce(
        (acc, theme) => ({
            ...acc,
            [theme]: createMuiTheme(assign({}, defaults, themesConfig[theme])),
        }),
        {}
    ) as any;
}

const themes = m({
    blue,
});

export default themes;
