import Type from "../../util/Type";
import movie from "./movie";
import { Mode } from "./type";

const modes = Type<Mode>()({
    movie,
});

export default modes;
