const setRef = <T = any>(
  ref: React.RefObject<T> | React.MutableRefObject<T> | ((instance: T | null) => void) | null | undefined,
  value: T | null,
): void => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as React.MutableRefObject<T>).current = value as T;
  }
};

export default setRef;
