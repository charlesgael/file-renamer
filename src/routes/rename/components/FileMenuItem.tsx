import React, { FC, MouseEventHandler } from "react";
import { makeStyles, MenuItem, ListItem, Tooltip } from "@material-ui/core";
import { MyFile } from "../MyFile";
import { IoIosWarning } from "react-icons/io";
import { ListItemIcon } from "../../../components/Material";

const useStyles = makeStyles((theme) => ({
    root: {
        fontSize: "0.7rem",
        display: "flex",
        alignItems: "center",
    },
    filename: {
        flexGrow: 1,
        textOverflow: "ellipsis",
        minWidth: 0,
        overflow: "hidden",
    },
    warnings: {
        flexShrink: 0,
        padding: theme.spacing(0, 1),
    },
    extension: {
        flexShrink: 0,
        background: theme.palette.warning.main,
        borderRadius: 2,
        padding: theme.spacing(0, 1),
    },
}));

const FileMenuItem: FC<{
    file?: MyFile;
    onClick: MouseEventHandler<HTMLLIElement>;
    selected?: boolean;
}> = ({ file, onClick, selected }) => {
    // hooks
    const classes = useStyles();

    // component
    if (!file) return <ListItem />;

    return (
        <MenuItem onClick={onClick} selected={selected}>
            {/[\\\/:*<>?"|]/.test(file.filename) && (
                <Tooltip title={`Forbidden characters '\/:*<>?"|'`}>
                    <ListItemIcon className={classes.warnings}>
                        <IoIosWarning />
                    </ListItemIcon>
                </Tooltip>
            )}
            <div className={classes.filename}>{file.filename}</div>
            <div className={classes.extension}>{file.extension}</div>
        </MenuItem>
    );
};

export default FileMenuItem;
