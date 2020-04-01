import React from "react";
import setRef from "./setRef";

const useForkRef = <T>(refA: React.Ref<T>, refB: React.Ref<T>): React.Ref<T> => {
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null;
    }
    return (refValue: T | null) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
};

export default useForkRef;
