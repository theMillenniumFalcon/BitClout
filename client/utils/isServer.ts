// * as there is no window object on server
export const isServer = () => typeof window === "undefined"