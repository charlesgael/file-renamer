import { useState } from "react";
import { search } from "../../../rename-api/api";
import { Api } from "../../../rename-api/api/type";
import { MediaProps } from "../../../rename-api/Media";
import { MyFile } from "../MyFile";

interface Search {
    mode: string;
}

interface SearchNotSure extends Search {
    result: undefined;
    notSure: MediaProps[];
}

interface SearchResults extends Search {
    result: MediaProps;
    notSure: undefined;
}

interface State {
    in: MyFile;
    search?: SearchNotSure | SearchResults;
}

export default function useFileState() {
    const [fileList, setFileList] = useState<State[]>([]);
    const [selectedFile, setSelectedFile] = useState<number>(-1);
    const addFiles = (files: MyFile[]) => setFileList([...fileList, ...files.map((it) => ({ in: it }))]);
    const replaceFile = (index: number, file: State) => {
        fileList.splice(index, 1, file);
        setFileList([...fileList]);
    };
    const removeFile = (id: number) => {
        if (!fileList[id]) return;
        fileList.splice(id, 1);
        if (selectedFile >= fileList.length) setSelectedFile(-1);
        setFileList([...fileList]);
    };
    const removeFiles = (ids: number[]) => {
        setFileList(fileList.filter((val, idx) => !ids.includes(idx)));
    };
    const clearFiles = () => {
        setSelectedFile(-1);
        setFileList([]);
    };
    const searchMedia = async (api: Api) => {
        const mode = api.mode;

        if (mode) {
            const changed = await Promise.all(
                fileList.map<Promise<State>>(async ({ in: input, search: s }) => {
                    if (!s) {
                        const results = await search(api, input.filename);
                        if (results.length === 0) {
                            return {
                                in: input,
                            };
                        }
                        if (results.length === 1) {
                            return {
                                in: input,
                                search: {
                                    mode,
                                    result: results[0],
                                    notSure: undefined,
                                },
                            };
                        }

                        return {
                            in: input,
                            search: {
                                mode,
                                result: undefined,
                                notSure: results,
                            },
                        };
                    }
                    return {
                        in: input,
                        s,
                    };
                })
            );
            setFileList(changed);
        }
    };

    return {
        fileList,
        addFiles,
        replaceFile,
        removeFile,
        removeFiles,
        clearFiles,
        selectedFile,
        setSelectedFile,
        searchMedia,
    };
}
