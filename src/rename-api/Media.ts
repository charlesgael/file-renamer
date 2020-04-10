import homedir from "homedir";
import seval from "safe-eval";

export class MediaProps {
    n?: string; // movie / series name
    y?: number; // movie / series year
    primaryTitle?: string; // primary name
    alias?: string; // alias names
    id?: number; // movie series id
    actors?: string[]; // list of actors
    genre?: string; // primary genre
    genres?: string[]; // all genres
    certification?: string; // content rating
    rating?: number; // movie rating
    d?: string; // airdate
    type?: string; // object type

    // movies
    director?: string; // movie director
    collection?: string; // movie collection
    ci?: number; // movie collection index

    // // series
    s?: number; // season number
    e?: number; // episode number
    startdate?: string; // series start date
    absolute?: number; // absolute episode number
    t?: string; // episode title

    // // music
    album?: string; // audio track album
    artist?: string; // audio track artist
    albumArtist?: string; // album artist
}

const classToObject = (theClass: object) => {
    const originalClass = theClass || {};
    const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass));
    return keys.reduce((classAsObj, key) => {
        (classAsObj as any)[key] = (originalClass as any)[key];
        return classAsObj;
    }, {});
};

// tslint:disable-next-line:max-classes-per-file
class StringHelper extends String {
    pad: typeof String.prototype.padEnd;
    lower: typeof String.prototype.toLowerCase;
    upper: typeof String.prototype.toUpperCase;

    constructor(str: string) {
        super(str);
        this.pad = String.prototype.padEnd;
        this.lower = String.prototype.toLowerCase;
        this.upper = String.prototype.toUpperCase;
    }

    removeIllegalCharacters(replacement = "") {
        return new StringHelper(this.split(/[\\\/:*<>?"|]+/).join(replacement));
    }

    space(replacement = "") {
        return new StringHelper(this.split(/[ :]+/).join(replacement));
    }

    colon(replacement = "") {
        return new StringHelper(this.split(/[ ]*:[ ]*/).join(replacement));
    }

    slash(replacement = "") {
        return new StringHelper(this.split(/\//).join(replacement));
    }

    upperInitial() {
        return new StringHelper(
            this.split(" ")
                .map((it) => it.charAt(0).toUpperCase() + it.slice(1))
                .join(" ")
        );
    }

    lowerTrail() {
        return new StringHelper(
            this.split(" ")
                .map((it) => it.charAt(0) + it.slice(1).toLowerCase())
                .join(" ")
        );
    }

    replaceAll(pattern: string, replacement = "") {
        return new StringHelper(this.split(pattern).join(replacement));
    }
}

// tslint:disable-next-line:max-classes-per-file
class NumberHelper extends Number {
    constructor(num: number) {
        super(num);
    }

    round(precision: number, padding = "0") {
        const str = this.toPrecision(precision).toString();
        const idx = str.indexOf(".");
        return new StringHelper(str.padEnd(idx > -1 ? idx + 1 + precision : str.length + precision, padding));
    }
}

const getProxy = <Type extends object>(theClass: Type) => {
    return new Proxy<Type>(
        { ...classToObject(theClass), ...theClass },
        {
            get(obj: any, prop: string) {
                if (prop in obj) {
                    if (["constructor", "writeAs"].includes(prop)) {
                        return obj[prop];
                    }
                    const val = typeof obj[prop] === "function" ? obj[prop]() : obj[prop];
                    switch (typeof val) {
                        case "string":
                            return new StringHelper(val);
                        case "number":
                            return new NumberHelper(val);
                    }
                }

                return undefined;
            },
        }
    );
};

// tslint:disable-next-line:max-classes-per-file
export default class Media extends MediaProps {
    constructor(options: MediaProps) {
        super();
        // Copy properties
        for (const op in options) {
            if (options.hasOwnProperty(op)) {
                (this as any)[op] = (options as any)[op];
            }
        }
    }

    ny() {
        if (this.n) return this.n + (this.y ? ` (${this.y})` : "");
        return;
    }

    az() {
        if (this.n) {
            const az = this.n[0].toUpperCase();
            return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(az) ? "#" : az;
        }
        return;
    }

    sxe() {
        if (this.s && this.e) {
            return `${this.s}x${this.e.toString().padStart(2, "0")}`;
        }
        return;
    }

    s00e00() {
        if (this.s && this.e) {
            return `s${this.s.toString().padStart(2, "0")}e${this.e.toString().padStart(2, "0")}`;
        }
        return;
    }

    home() {
        return homedir().split("\\").join("/");
    }

    writeAs(format: string) {
        const reEval = /\{(?<eval>[^}]+)\}/g;
        const pieces = format.split(/\{[^}]+\}/);
        const evals = [];
        const self = getProxy(this);
        const matches = format.matchAll(reEval);
        for (const match of matches) {
            try {
                const res = seval(match!.groups!.eval, self);
                if (res instanceof StringHelper || res instanceof NumberHelper) evals.push(res);
                else evals.push("");
            } catch (e) {
                evals.push("");
            }
        }

        return String.raw(({ raw: pieces } as any) as TemplateStringsArray, ...evals);
    }
}
