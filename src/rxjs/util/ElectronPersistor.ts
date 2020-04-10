import { Persistor } from "rxjs-class-react-hook";
import ElectronStore from "electron-store";

export default class ElectronPersistor<T = any> implements Persistor<T> {
    private key: string;
    private store: ElectronStore;
    constructor(key: string, config?: ElectronStore.Options<any>) {
        this.key = key;

        const safeConfig: ElectronStore.Options<any> = {
            accessPropertiesByDotNotation: false,
            ...config,
        };
        this.store = new ElectronStore(safeConfig);
    }

    async save(data: T) {
        this.store.set(this.key, data);
    }

    async load() {
        return this.store.get(this.key);
    }

    async delete() {
        this.store.delete(this.key);
    }
}
