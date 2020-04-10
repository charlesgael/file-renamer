import modes from "../modes";
import { MediaProps } from "../Media";

interface Api {
    mode: keyof typeof modes;
    name: string;
    // key: string;
    search: (query: string) => Promise<Results>;
    details: (id: string | number) => Promise<MediaProps>;
}

interface Results {
    total: number;
    results: MediaProps[];
}
