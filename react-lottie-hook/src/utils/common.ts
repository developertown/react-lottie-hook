export const array = {
  isPopulated: (item: unknown[] | undefined): boolean => Array.isArray(item) && item.length > 0,
};

export const object = {
  isPopulated: (obj: { [key: string]: any | any[] } | undefined): boolean =>
    !!obj && typeof obj === "object" && Object.keys(obj).length > 0,
};

export const string = {
  isEmpty: (str: string | undefined): boolean => typeof str === "string" && str.length === 0,
  isPopulated: (str: string | undefined): boolean => typeof str === "string" && str.length > 0,
};

export const number = {
  is: (number: number | undefined): boolean => typeof number === "number",
};

export const boolean = {
  is: (boolean: boolean | number | undefined): boolean =>
    typeof boolean === "boolean" || (typeof boolean === "number" && Boolean(boolean)),
};
