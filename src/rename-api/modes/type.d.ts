import Media from "../Media";

type ArrayOneOrMore<T> = {
    0: T;
} & T[];

export interface Mode {
    name: string;
    formats: ArrayOneOrMore<string>;
    sample: Media;
}
