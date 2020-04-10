import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";
import useRouteValidator from "./useRouteValidator";
import WithMenu, { MenuItemProps } from "./WithMenu";
import { Rename } from "../SvgComponents";
import RenameRoute from "../../routes/rename/RenameRoute";

const UrlMapping: FC = () => {
    const redirect = useRouteValidator({
        "/": () => "/rename",
    });

    const menuItems: MenuItemProps[] = [
        {
            to: "/rename",
            text: "Rename",
            icon: <Rename />,
        },
    ];

    if (redirect) return redirect;

    return (
        <Switch>
            {/* Without menu */}
            {/* With menu */}
            <Route>
                <WithMenu menuItems={menuItems}>
                    <Switch>
                        <Route path="/rename" component={RenameRoute} />
                    </Switch>
                </WithMenu>
            </Route>
        </Switch>
    );
};

export default UrlMapping;
