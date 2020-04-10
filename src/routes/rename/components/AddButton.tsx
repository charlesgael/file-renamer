import { Button } from "@material-ui/core";
import { api } from "electron-util";
import React, { FC } from "react";
import { Folder } from "../../../components/SvgComponents";
import { MyFile } from "../MyFile";

const AddButton: FC<{
    addFiles: (files: MyFile[]) => void;
}> = ({ addFiles }) => {
    const openFile = () => {
        const selection = api.dialog.showOpenDialogSync({
            filters: [
                {
                    name: "Movie",
                    extensions: [
                        "webm",
                        "mpg",
                        "mp2",
                        "mpeg",
                        "mpe",
                        "mpv",
                        "ogg",
                        "mp4",
                        "m4p",
                        "m4v",
                        "avi",
                        "wmv",
                        "mov",
                        "qt",
                        "flv",
                        "swf",
                        "avchd",
                        "mkv",
                    ],
                },
            ],
            properties: ["multiSelections", "dontAddToRecent"],
        });

        if (selection) {
            const myFiles: MyFile[] = selection
                .map((it) => MyFile.fromPath(it)) // (MyFile | undefined)[]
                .filter((it) => it !== undefined) as MyFile[]; // MyFile[]
            addFiles(myFiles);
        }
    };
    return (
        <Button size="small" startIcon={<Folder />} onClick={openFile}>
            Add
        </Button>
    );
};

export default AddButton;
