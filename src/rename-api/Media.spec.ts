import modes from "./modes";
import homedir from "homedir";
import Media from "./Media";

describe("test Media lib", () => {
    const expects = [
        "Avengers - L'Ère d'Ultron (2015)",
        "Avengers : L'Ère d'Ultron (2015, Joss Whedon)",
        "Avengers.L'Ère.d'Ultron.2015",
        "Avengers : L'Ère d'Ultron (2015)/Avengers : L'Ère d'Ultron (2015)",
        "Action/Avengers : L'Ère d'Ultron [2015,PG-13,7.3]",
        `${homedir().split("\\").join("/")}/Movies/Avengers - L'Ère d'Ultron (2015)`,
    ];

    const m = modes.movie.sample;
    let idx = 0;
    test.each(modes.movie.formats)("Test format ", (format: string) => {
        expect(m.writeAs(format)).toBe(expects[idx++]);
    });

    test("Speed test (100x in <2s)", () => {
        const collection = Array<Media>(100).fill(m);

        const begin = new Date();
        collection.map((it) => it.writeAs(modes.movie.formats[0]));
        const end = new Date();

        expect(end.getTime() - begin.getTime()).toBeLessThanOrEqual(2000);
    });
});
