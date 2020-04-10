import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Paper, TextField } from "@material-ui/core";
import cx from "classnames";
import React, { ChangeEvent, FC, useState } from "react";
import { MdClose } from "react-icons/md";
import { useRouteMatch } from "react-router-dom";
import modes from "../../../rename-api/modes";
import FormatsSelector from "../../../rxjs/formats.selector";
import formatsStore from "../../../rxjs/formats.store";

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
    examples: {
        padding: theme.spacing(1, 1),
    },
    example: {
        display: "flex",
        "& .val": {
            flex: 1,
            padding: theme.spacing(0, 1),
            textOverflow: "ellipsis",
            minWidth: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
        },
        "& .label": {
            display: "block",
            textAlign: "left",
        },
    },
}));

const useTextInput = (value?: string): [string, (value: string) => void, React.ChangeEventHandler<HTMLInputElement>] => {
    const [format, setFormat] = useState(value || "");

    const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormat(event.currentTarget.value);
    };

    return [format, setFormat, inputChange];
};

const PopinFormat: FC<{
    onClose: () => void;
}> = ({ onClose }) => {
    // hooks
    const classes = useStyles();
    const {
        params: { key },
    } = useRouteMatch();

    const mode = modes.get(key);
    const formats = new FormatsSelector(formatsStore.useState());
    const [format, setFormat, formatChange] = useTextInput(formats.getFormat(key));
    const changeFormat = (f: string) => () => setFormat(f);

    const submit = () => {
        if (format.length > 0) {
            formatsStore.setFormat(key, format);
            onClose();
        } else {
            // FIXME Material-UI snackbar [notisnack](https://github.com/iamhosseindhv/notistack)
            alert("Format cannot be empty");
        }
    };

    // render
    if (!mode) return null;

    return (
        <Dialog open={true} maxWidth="md" fullWidth>
            <DialogTitle>
                {mode.name} Format
                <IconButton className={classes.closeButton} onClick={onClose}>
                    <MdClose />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.subtitle}>
                <div>{format && mode.sample.writeAs(format)}</div>
            </DialogContent>
            <DialogContent className={cx(classes.bggrey, classes.spaced)}>
                <TextField variant="outlined" fullWidth value={format} onChange={formatChange} />

                <div>
                    <div>Examples</div>
                    <Paper className={classes.examples}>
                        {mode.formats.map((it, i) => (
                            <div key={`example-${i}`} className={classes.example}>
                                <Button className="val" classes={{ label: "label" }} onClick={changeFormat(it)}>
                                    {it}
                                </Button>
                                <div>...</div>
                                <div className="val">{mode.sample.writeAs(it)}</div>
                            </div>
                        ))}
                    </Paper>
                </div>
            </DialogContent>
            <DialogActions className={classes.bggrey}>
                <Button variant="contained" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={submit}>
                    Use Format
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopinFormat;
