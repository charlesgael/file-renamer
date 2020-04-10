import { Selector } from "rxjs-class-react-hook";
import { FormatsStoreData } from "./formats.store";
import modes from "../rename-api/modes";

export default class FormatsSelector extends Selector<FormatsStoreData> {
    getFormat(mode: string) {
        if ((modes.keys() as string[]).includes(mode)) {
            return this.state[mode];
        }
        return;
    }
}
