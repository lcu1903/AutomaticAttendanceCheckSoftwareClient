export const isNullOrWhiteSpace = (str: string) => {
    return !str || /^\s*$/.test(str);
}

export const isNullOrEmptyNumber = (num: number | null | undefined | ""): boolean => {
    return num === null || num === undefined || num === "";
};
