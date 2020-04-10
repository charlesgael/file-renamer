import { ListItemIcon as MUIListItemIcon, withStyles } from "@material-ui/core";

const ListItemIcon = withStyles((theme) => ({
    root: {
        minWidth: 0,
        paddingRight: theme.spacing(1),
    },
}))(MUIListItemIcon);

export default ListItemIcon;
