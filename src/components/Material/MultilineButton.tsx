import { Button, withStyles } from "@material-ui/core";

const MultilineButton = withStyles(
    (theme) => ({
        root: {
            display: "block",
        },
    }),
    {
        name: "MultilineButton",
    }
)(Button);

export default MultilineButton;
