import shoesGlobal from "./shoes.json";
import shoesRW from "./shoes-rw.json";

const useRW = import.meta.env.VITE_USE_RW === "true";

export const allShoes = useRW ? shoesRW : shoesGlobal;