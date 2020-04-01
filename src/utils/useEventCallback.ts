import React from "react";

const useEnhancedEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export type EventCallback = (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;

export default function useEventCallback(fn: EventCallback) {
  const ref = React.useRef<EventCallback>(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });

  return React.useCallback((event: any) => (void 0, ref.current)(event), []);
}
