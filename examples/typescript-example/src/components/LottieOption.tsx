import React from "react";
import { useLottie, Lottie } from "react-lottie-hook";
import { AnimationConfigWithData } from "lottie-web";

interface LottieOptionProps {
  animationData: AnimationConfigWithData;
}

const LottieOption: React.FC<LottieOptionProps> = ({ animationData }) => {
  const [lottieRef] = useLottie({
    renderer: "svg",
    animationData,
  });

  return <Lottie lottieRef={lottieRef} height={100} width={100} />;
};

export default LottieOption;
