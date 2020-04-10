import Type from "../../util/Type";
import tmdbMovie from "./tmdb-movie/tmdb-movie";
import { Api } from "./type";

const api = Type<Api>()({
    tmdbMovie,
});

export async function search(module: Api, str: string) {
    const searchParts = str.split(/[^a-zA-Z\u00C0-\u017F]+/);
    let lastTest: string | undefined;
    while (searchParts.length) {
        const thisTest = searchParts.join(" ").trim();
        if (thisTest !== lastTest) {
            try {
                const result = await module.search(thisTest);
                if (result.total > 0) {
                    return result.results;
                }
            } catch (e) {
                // do something
            }
        }
        lastTest = thisTest;
        searchParts.pop();
    }
    return [];
}

export default api;
