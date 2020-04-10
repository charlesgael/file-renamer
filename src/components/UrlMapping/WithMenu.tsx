import { Divider, Drawer, List, makeStyles } from "@material-ui/core";
import React, { FC, ReactElement, ReactNode } from "react";
import MenuItem from "./MenuItem";

const DRAWER_WIDTH = 140;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        height: "100%",
    },
    drawer: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
    },
    drawerPaper: {
        width: DRAWER_WIDTH,
        padding: theme.spacing(1),
    },
    content: {
        flexGrow: 1,
    },
}));

interface MenuItemPropItemType {
    to: string;
    text: ReactNode;
    icon?: ReactElement<{ width: number | string; height: number }>;
}

export type MenuItemProps = MenuItemPropItemType | "separator";

const WithMenu: FC<{
    menuItems: MenuItemProps[];
}> = ({ children, menuItems }) => {
    const classes = useStyles();

    const separated: MenuItemPropItemType[][] = menuItems.reduce((acc, it) => {
        const last = acc.pop() || [];
        if (it === "separator") {
            return [...acc, last, []];
        }
        return [...acc, [...last, it]];
    }, ([] as any) as MenuItemPropItemType[][]);

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {separated.map((list, listId) => (
                    <div key={`list-${listId}`}>
                        {listId > 0 && <Divider />}
                        <List>
                            {list.map((it, i) => (
                                <MenuItem key={`item-${i}`} to={it.to} text={it.text} icon={it.icon} />
                            ))}
                        </List>
                    </div>
                ))}
            </Drawer>
            <main className={classes.content}>{children}</main>
        </div>
    );
};

export default WithMenu;
