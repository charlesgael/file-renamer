import tmdbMovie from "./tmdb-movie";
import { search } from "..";

describe("Test tmdb engine", () => {
    test("Search well formatted", async () => {
        const res = await search(tmdbMovie, "Avengers - L'Ère d'Ultron (2015)");
        expect(res![0].n).toBe("Avengers: Age of Ultron");
    });

    test.each([
        "Captain America - First Avenger (2011) [1080p BluRay] [FR(VFF)-EN] [x265 10-bit AC3] [GWEN]",
        "Captain.America.First.Avenger.2011.TRUEFRENCH.Blu-Ray.1080.x265.HEVC.DTS-STARLIGHTER",
    ])("Bizarre formats", async (str: string) => {
        const res = await search(tmdbMovie, str);
        expect(res![0].n).toBe("Captain America: The First Avenger");
    });
});
