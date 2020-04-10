import React from "react";
import { Redirect, useLocation } from "react-router-dom";

const useRouteValidator = <V extends any[]>(
    routeRules: {
        [rule: string]: (this: any, ...args: V) => undefined | boolean | string;
    },
    ...deps: V
) => {
    // Hooks
    const location = useLocation();

    // Fn
    const getTestKeys = (pathname: string) => Object.keys(routeRules).filter((it) => new RegExp(`^${it}$`).test(pathname));
    console.groupCollapsed("Routing", location.pathname);
    const toTest = getTestKeys(location.pathname);
    console.log("to test", toTest);
    let newPath: string | undefined;
    if (!toTest.length) {
        console.log("no validation");
    }
    for (const it of toTest) {
        console.group("test of", it);
        const result = routeRules[it](...deps);
        console.log("should change", deps, typeof result === "string");
        if (typeof result === "string") {
            console.log(`redirecting to "${result}"`);
            newPath = result;
            console.groupEnd();
            break;
        }
        console.groupEnd();
    }
    if (newPath && newPath !== location.pathname) {
        console.log(deps);
        console.groupEnd();
        return React.createElement(Redirect, { to: newPath });
    }
    console.groupEnd();
    return null;
};

export default useRouteValidator;
