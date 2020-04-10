import * as _path from "path";

export class MyFile {
    filename: string;
    extension: string;
    path: string;

    constructor(path: string) {
        this.path = path;

        const name = path.split(_path.sep).pop()!;

        const match = /^(?<filename>.+)\.(?<extension>[^.]+)$/.exec(name);
        if (!match) throw new Error("Could not load file");

        this.filename = match!.groups!.filename;
        this.extension = match!.groups!.extension;
    }

    clone() {
        return new MyFile(this.path);
    }

    cd(to: string) {
        const folder = this.path.split(_path.sep).slice(0, -1).join(_path.sep);

        return new MyFile((_path.isAbsolute(to) ? to : _path.join(folder, to)) + `.${this.extension}`);
    }

    static fromDom(file: File) {
        try {
            return new MyFile(file.path);
        } catch (e) {
            return undefined;
        }
    }

    static fromPath(path: string) {
        try {
            return new MyFile(path);
        } catch (e) {
            return undefined;
        }
    }
}
