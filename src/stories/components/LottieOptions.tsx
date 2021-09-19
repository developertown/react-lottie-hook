import React from "react";
import { useLottie, Lottie } from "../../";
import { AnimationConfigWithData } from "lottie-web";
import { Renderer } from "../../types";

interface LottieOptionProps {
  animationData: AnimationConfigWithData;
}

const LottieOption: React.FC<LottieOptionProps> = ({ animationData }) => {
  const [lottieRef] = useLottie({
    renderer: Renderer.svg,
    animationData,
  });

  return <Lottie lottieRef={lottieRef} height={100} width={100} />;
};

export default LottieOption;
