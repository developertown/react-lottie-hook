export const array = {
  isPopulated: (item: unknown[] | undefined): boolean => Array.isArray(item) && item.length > 0,
};

export const object = {
  isPopulated: (obj: object | undefined): boolean => !!obj && typeof obj === "object" && Object.keys(obj).length > 0,
};
