import { withStyles, MenuItem } from "@material-ui/core";

const MenuTextItem = withStyles((theme) => ({
    root: {
        backgroundColor: "transparent",
        cursor: "default",
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
}))(MenuItem);

export default MenuTextItem;
