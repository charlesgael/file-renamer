import { Button, IconButton, List, makeStyles, Tooltip, Typography } from "@material-ui/core";
import fs from "fs-extra";
import path from "path";
import React, { FC } from "react";
import { FaCheck } from "react-icons/fa";
import { MdRemoveCircleOutline } from "react-icons/md";
import { Route, useHistory } from "react-router-dom";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { MultilineButton } from "../../components/Material";
import { Duster } from "../../components/SvgComponents";
import { Api } from "../../rename-api/api/type";
import Media from "../../rename-api/Media";
import FormatsSelector from "../../rxjs/formats.selector";
import formatsStore from "../../rxjs/formats.store";
import AddButton from "./components/AddButton";
import FileMenuItem from "./components/FileMenuItem";
import MatchButton from "./components/MatchButton";
import PopinFormat from "./components/PopinFormat";
import PopinNotSure from "./components/PopinNotSure";
import useCustomDropzone from "./hooks/useCustomDropzone";
import useFileState from "./hooks/useFileState";
import { MyFile } from "./MyFile";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    title: {
        margin: 0,
        padding: theme.spacing(1),
        borderBottom: "solid 1px",
        borderBottomColor: theme.palette.grey[300],
    },
    content: {
        flexGrow: 1,
        display: "flex",
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    centerButtons: {
        width: 120,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        "& > *": {
            margin: theme.spacing(2, 0),
        },
    },
    list: {
        flex: 1,
        border: "solid 1px",
        borderColor: theme.palette.grey[300],
        borderRadius: 5,
        position: "relative",
        background: "#ffffff",
        "& legend": {
            fontSize: "1rem",
            fontWeight: "bold",
            paddingBottom: 10,
        },
    },
    listContent: {
        position: "absolute",
        top: 16,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
    },
    buttonsBottom: {
        display: "flex",
        justifyContent: "center",
        background: theme.palette.grey[100],
        borderRadius: "0 0 5px 5px",
        borderTop: "solid 1px",
        borderColor: theme.palette.grey[300],
        padding: theme.spacing(1),
        "& > *": {
            margin: theme.spacing(0, 0.5),
        },
    },
    listItem: {
        flex: 1,
        overflow: "auto",
        paddingTop: theme.spacing(1),
    },
}));

const RenameRoute: FC = () => {
    // Hooks
    const classes = useStyles();
    const {
        fileList,
        addFiles,
        replaceFile,
        removeFile,
        removeFiles,
        clearFiles,
        selectedFile,
        setSelectedFile,
        searchMedia,
    } = useFileState();

    const onDrop = (files: File[]) => {
        const myFiles: MyFile[] = files
            .map(MyFile.fromDom) // (MyFile | undefined)[]
            .filter((it) => it !== undefined) as MyFile[]; // MyFile[]
        addFiles(myFiles);
    };

    const { rootProps } = useCustomDropzone(onDrop);
    const selectFile = (idx: number) => () => setSelectedFile(idx);
    const removeSelected = () => removeFile(selectedFile);

    const history = useHistory();
    const closeFormat = () => history.push("/rename");

    const formats = new FormatsSelector(formatsStore.useState());
    const onApiSelected = (api: Api) => searchMedia(api);

    const notSureIdx = fileList.findIndex((it) => it.search?.notSure !== undefined);
    const notSure = fileList[notSureIdx];
    const confirmNotSure = (resultId: number) => {
        const file = fileList[notSureIdx];
        const search = file.search!;
        if (resultId >= 0) {
            const selected = search.notSure?.[resultId];
            if (selected) {
                replaceFile(notSureIdx, {
                    in: file.in,
                    search: {
                        mode: search.mode,
                        result: selected,
                        notSure: undefined,
                    },
                });
            }
        } else {
            replaceFile(notSureIdx, {
                in: file.in,
            });
        }
    };
    const transformedFile = (it: typeof fileList[0]) => {
        if (it.search && it.search.result) {
            const f = formats.getFormat(it.search.mode);
            if (f) {
                return it.in.cd(new Media(it.search.result).writeAs(f));
            }
        }
        return;
    };

    const execListener = (copy?: boolean) => () => {
        Promise.allSettled(
            fileList.map(async (it, idx) => {
                if (it.search && it.search.result) {
                    const f = formats.getFormat(it.search.mode);
                    if (f) {
                        const destf = it.in.cd(new Media(it.search.result).writeAs(f));
                        const destFolder = destf.path.split(path.sep).slice(0, -1).join(path.sep);

                        if (!fs.existsSync(destFolder)) {
                            fs.mkdirSync(destFolder, {
                                recursive: true,
                            });
                        }

                        if (copy) {
                            fs.copySync(it.in.path, destf.path);
                        } else {
                            fs.moveSync(it.in.path, destf.path);
                        }
                        return idx;
                    }
                    throw new Error("mode not valid");
                }
                throw new Error("no search nor search result");
            })
        ).then((results) => {
            const converted: number[] = [];
            for (const result of results) {
                if (result.status === "fulfilled") {
                    converted.push(result.value);
                }
            }
            removeFiles(converted);
        });
    };

    // Component
    return (
        <>
            {notSureIdx >= 0 && (
                <PopinNotSure input={notSure.in.filename} options={notSure.search!.notSure!} onOptionChosen={confirmNotSure} />
            )}
            <Route path="/rename/format/:key">
                <PopinFormat onClose={closeFormat} />
            </Route>
            <ScrollSync>
                <div className={classes.root}>
                    <h1 className={classes.title}>Rename</h1>
                    <div className={classes.content}>
                        {/* LEFT BLOCK */}
                        <fieldset className={classes.list}>
                            <legend>Original files</legend>
                            <div className={classes.listContent}>
                                <ScrollSyncPane>
                                    <div className={classes.listItem} {...rootProps}>
                                        <List dense disablePadding>
                                            {fileList.map((it, i) => (
                                                <FileMenuItem
                                                    key={`file-${i}`}
                                                    file={it.in}
                                                    onClick={selectFile(i)}
                                                    selected={selectedFile === i}
                                                />
                                            ))}
                                        </List>
                                    </div>
                                </ScrollSyncPane>
                                <div className={classes.buttonsBottom}>
                                    <AddButton addFiles={addFiles} />
                                    <Tooltip title="Remove selected items">
                                        <IconButton size="small" onClick={removeSelected}>
                                            <MdRemoveCircleOutline />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Clear all">
                                        <IconButton size="small" onClick={clearFiles}>
                                            <Duster />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        </fieldset>
                        {/* CENTER BLOCK */}
                        <div className={classes.centerButtons}>
                            <MatchButton onApiSelected={onApiSelected} />
                            <MultilineButton variant="contained" onClick={execListener()}>
                                <Typography variant="h4" component="div">
                                    <FaCheck />
                                </Typography>
                                <div>Rename</div>
                            </MultilineButton>
                        </div>
                        {/* RIGHT BLOCK */}
                        <fieldset className={classes.list}>
                            <legend>New names</legend>
                            <div className={classes.listContent}>
                                <ScrollSyncPane>
                                    <div className={classes.listItem}>
                                        <List dense disablePadding>
                                            {fileList.map((it, i) => (
                                                <FileMenuItem
                                                    key={`file-dest-${i}`}
                                                    file={transformedFile(it)}
                                                    onClick={selectFile(i)}
                                                    selected={selectedFile === i}
                                                />
                                            ))}
                                        </List>
                                    </div>
                                </ScrollSyncPane>
                                <div className={classes.buttonsBottom}>
                                    <MatchButton mini onApiSelected={onApiSelected} />
                                    <Button size="small" startIcon={<FaCheck />} onClick={execListener()}>
                                        Rename
                                    </Button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </ScrollSync>
        </>
    );
};

export default RenameRoute;
