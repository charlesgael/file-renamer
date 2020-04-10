import Axios from "axios";
import { Api } from "../type";
import apiKeys from "../../../../.api.keys.json";

if (!apiKeys.TMDB_API_KEY) {
    console.error("TMDB key not set (check in `.env` file)");
}
const axios = Axios.create({
    baseURL: "https://api.themoviedb.org/3",
});
const API_KEY = "api_key=" + apiKeys.TMDB_API_KEY;
// const instance = new Tmdb({ apiKey: apiKeys.TMDB_API_KEY });

const tmdbMovie: Api = {
    mode: "movie",
    name: "TheMovieDB",
    async search(s) {
        const { data } = await axios.get<ImdbSearchResponse>(`/search/movie?query=${encodeURI(s)}&${API_KEY}`);

        return {
            total: data.total_results,
            results: data.results.map((it) => ({
                n: it.title,
                d: it.release_date,
                y: new Date(it.release_date).getFullYear(),
                id: it.id,
                primaryTitle: it.original_title,
                rating: it.vote_average,
                type: "Movie",
            })),
        };
    },
    async details(id) {
        const { data } = await axios.get<ImdbDetailsResponse>(`/movie/${id}?${API_KEY}`);
        const [resActors, resCollection] = await Promise.all([
            axios.get<ImdbCreditsResponse>(`/movie/${id}/credits?${API_KEY}`),
            data.belongs_to_collection && axios.get<ImdbCollectionResponse>(`/collection/${data.belongs_to_collection.id}?${API_KEY}`),
        ]);
        const actors = resActors.data;
        const collection = resCollection?.data;

        return {
            collection: data.belongs_to_collection?.name,
            genres: data.genres.map((it) => it.name),
            genre: data.genres[0]?.name,
            id: data.id,
            primaryTitle: data.original_title,
            rating: data.vote_average,
            d: data.release_date,
            actors: actors.cast.map((it) => it.name),
            n: data.title,
            ci: data.belongs_to_collection ? collection?.parts.map((col) => col.id).indexOf(data.belongs_to_collection?.id) : undefined,
            type: "Movie",
            y: new Date(data.release_date).getFullYear(),
        };
    },
};

export default tmdbMovie;
