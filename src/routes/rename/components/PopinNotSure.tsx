import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    makeStyles,
    MenuItem,
    Paper,
} from "@material-ui/core";
import cx from "classnames";
import React, { FC, useState } from "react";
import Media, { MediaProps } from "../../../rename-api/Media";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    subtitle: {
        borderBottom: "solid 1px",
        borderBottomColor: theme.palette.grey[500],
    },
    bggrey: {
        background: theme.palette.grey[100],
    },
    spaced: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2),
        },
    },
    list: {
        maxHeight: 500,
        overflowY: "scroll",
    },
}));

const PopinNotSure: FC<{
    input: string;
    options: MediaProps[];
    format?: string;
    onOptionChosen: (resultId: number) => void;
}> = ({ input, options, format, onOptionChosen }) => {
    // hooks
    const classes = useStyles();
    const [selected, setSelected] = useState(-1);

    // listeners
    const skip = () => onOptionChosen(-1);
    const confirm = () => onOptionChosen(selected);
    const selectConfirm = (idx: number) => () => onOptionChosen(idx);
    const select = (idx: number) => () => setSelected(idx);

    //component
    return (
        <Dialog open={true} maxWidth="sm" fullWidth>
            <DialogTitle>Identification failed</DialogTitle>
            <DialogContent className={classes.subtitle}>
                <div>Failed to identify the following file:</div>
                <div>{input}</div>
            </DialogContent>
            <DialogContent className={cx(classes.bggrey, classes.spaced)}>
                <div>Select best match:</div>
                <Paper>
                    <List dense disablePadding className={classes.list}>
                        {options.map((it, i) => (
                            <MenuItem
                                key={`select-${i}`}
                                onClick={select(i)}
                                selected={i === selected}
                                onDoubleClick={selectConfirm(i)}
                            >
                                {new Media(it).writeAs(format!)}
                            </MenuItem>
                        ))}
                    </List>
                </Paper>
            </DialogContent>
            <DialogActions className={classes.bggrey}>
                <Button variant="contained" onClick={skip}>
                    Skip
                </Button>
                <Button variant="contained" color="primary" disabled={selected < 0} onClick={confirm}>
                    Select
                </Button>
            </DialogActions>
        </Dialog>
    );
};

PopinNotSure.defaultProps = {
    format: "{ny}",
};

export default PopinNotSure;
