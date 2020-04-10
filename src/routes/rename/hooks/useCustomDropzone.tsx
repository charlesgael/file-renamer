import { DropzoneOptions, useDropzone } from "react-dropzone";

export default function useCustomDropzone(dropCallback: DropzoneOptions["onDrop"]) {
    const { getRootProps, isDragActive } = useDropzone({
        onDrop: dropCallback,
        noClick: true,
        noKeyboard: true,
        noDragEventsBubbling: true,
    });
    return {
        rootProps: getRootProps(),
        isDragActive,
    };
}
