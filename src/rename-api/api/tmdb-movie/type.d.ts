interface ImdbCreditsResponse {
    id: number;
    cast: Cast[];
    crew: Crew[];
}

interface Crew {
    credit_id: string;
    department: string;
    gender: number;
    id: number;
    job: string;
    name: string;
    profile_path?: string;
}

interface Cast {
    cast_id: number;
    character: string;
    credit_id: string;
    gender: number;
    id: number;
    name: string;
    order: number;
    profile_path?: string;
}

interface ImdbDetailsResponse {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection: Belongstocollection | null;
    budget: number;
    genres: Genre[];
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    original_language: string;
    original_title: string;
    overview: string | null;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    revenue: number;
    runtime: number | null;
    status: string;
    tagline: string | null;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

interface Genre {
    id: number;
    name: string;
}

interface Belongstocollection {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
}

interface ImdbCollectionResponse {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    parts: Part[];
}

interface Part {
    id: number;
    video: boolean;
    vote_count: number;
    vote_average: number;
    title: string;
    release_date: string;
    original_language: string;
    original_title: string;
    genre_ids: number[];
    backdrop_path: string;
    adult: boolean;
    overview: string;
    poster_path: string;
    popularity: number;
}

interface ImdbSearchResponse {
    page: number;
    total_results: number;
    total_pages: number;
    results: Result[];
}

interface Result {
    popularity: number;
    vote_count: number;
    video: boolean;
    poster_path: string;
    id: number;
    adult: boolean;
    backdrop_path: string;
    original_language: string;
    original_title: string;
    genre_ids: number[];
    title: string;
    vote_average: number;
    overview: string;
    release_date: string;
}
