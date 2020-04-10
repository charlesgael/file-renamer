import { PersistStore } from "rxjs-class-react-hook";
import ElectronPersistor from "./util/ElectronPersistor";
import modes from "../rename-api/modes";

export interface FormatsStoreData {
    [k: string]: string;
}

class FormatsStore extends PersistStore<FormatsStoreData> {
    async setFormat(mode: string, format: string) {
        if ((modes.keys() as string[]).includes(mode)) {
            await this.merge({
                [mode]: format,
            });
            return;
        }
        throw new Error("No such mode");
    }
}

const formatsStore = new FormatsStore(
    modes.entries().reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: value.formats[0],
        }),
        {}
    ),
    new ElectronPersistor("formats"),
    {
        autoLoad: true,
        autoSave: true,
    }
);

export default formatsStore;
