import { ListItem, ListItemText, makeStyles } from "@material-ui/core";
import React, { FC, ReactElement, ReactNode } from "react";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    listItem: {
        display: "block",
        textAlign: "center",
        paddingTop: theme.spacing(2),
        border: "solid 1px",
        borderColor: "white",
        "&.active": {
            background: theme.palette.grey[300],
            boxShadow: "inset " + theme.shadows[5].split("),").join("), inset "),
            borderColor: theme.palette.grey[500],
        },
    },
}));

const MenuItem: FC<{
    exact?: boolean;
    to: string;
    icon?: ReactElement<{ width: number | string; height: number }>;
    text: ReactNode;
}> = ({ icon, text, to, exact }) => {
    const classes = useStyles();

    return (
        <ListItem button classes={{ root: classes.listItem }} component={NavLink} exact={Boolean(exact)} to={to} activeClassName="active">
            {/* <ListItemIcon></ListItemIcon> */}
            {icon && <div>{React.cloneElement(icon, { width: "100%", height: 48 })}</div>}
            <div>
                <ListItemText primary={text} />
            </div>
        </ListItem>
    );
};

export default MenuItem;
