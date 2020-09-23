import React, { useMemo, useCallback } from "react";
import { LottieProps } from "./types";

export const Lottie: React.FC<LottieProps> = (props) => {
  if (!props.lottieRef) {
    throw new Error(`Lottie component requires a valid ref but got: ${props.lottieRef}`);
  }
  const getSize = useCallback((initial = 200) => (typeof initial === "number" ? `${initial}px` : initial), []);

  const styles = useMemo(
    () => ({
      width: getSize(props.width),
      height: getSize(props.height),
      overflow: "hidden",
      margin: "0 auto",
      outline: "none",
      ...props.style,
    }),
    [props.style, props.width, props.height, getSize],
  );

  return (
    <div
      ref={(r): void => {
        props.lottieRef.current = r;
      }}
      className={props.className}
      style={styles}
      onKeyDown={props.onKeyDown}
      onClick={props.onClick}
      title={props.title}
      role={props.ariaRole}
      aria-label={props.ariaLabel}
      tab-index="0"
    />
  );
};
