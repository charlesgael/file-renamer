import { ThemeOptions } from "@material-ui/core";

const defaults: ThemeOptions = {
    overrides: {
        MuiButton: {
            root: {
                textTransform: "none",
            },
        },
    },
};

export default defaults;
