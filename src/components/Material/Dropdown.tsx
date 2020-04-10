import { makeStyles, Menu } from "@material-ui/core";
import cx from "classnames";
import React, { FC, ReactElement, SyntheticEvent, useState } from "react";
import MenuItemText from "./MenuItemText";

const useStyle = makeStyles((theme) => ({
    title: {
        fontWeight: "bold",
    },
}));

const Dropdown: FC<{
    menu: ReactElement;
}> = ({ menu, children }) => {
    // Hooks
    const classes = useStyle();
    const [id] = useState(
        Math.random()
            .toString(36)
            .substring(2) +
            Math.random()
                .toString(36)
                .substring(2)
    );
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Component
    const handleOpen = (event: SyntheticEvent<HTMLElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {React.isValidElement(children) && React.cloneElement(children, { onClick: handleOpen })}
            <Menu id={id} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {React.Children.map(menu.props.children, (it, i) => {
                    switch (it.type) {
                        case "title":
                        case "text":
                            return (
                                <MenuItemText
                                    className={cx(it.props.className, {
                                        [classes.title]: it.type === "title",
                                    })}
                                    disableRipple
                                >
                                    {it.props.children}
                                </MenuItemText>
                            );
                        default:
                            return React.cloneElement(it, {
                                onClick(...args: any[]) {
                                    handleClose();
                                    if (it.props.onClick) it.props.onClick.apply(it, args);
                                },
                            });
                    }
                })}
            </Menu>
        </>
    );
};

export default Dropdown;
