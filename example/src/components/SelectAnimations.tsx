import React, { useState } from "react";
import { AnimationConfigWithData } from "lottie-web";
import { animationTable, Animation, AnimationTitle } from "../animations";
import LottieOption from "./LottieOption";

interface SelectProps {
  onClick: (value: AnimationTitle) => (e: React.MouseEvent) => void;
  value: string;
  animations: { id: number; title: string }[];
}

const SelectAnimations: React.FC<SelectProps> = ({
  onClick,
  value,
  animations,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="change-animations">
      {!open && (
        <div className="change-animations-select" onClick={() => setOpen(true)}>
          Open Animation Selection
        </div>
      )}
      {open && (
        <div className="change-animations-list-container">
          <span
            className="change-animations-close"
            onClick={() => setOpen(false)}
          >
            X
          </span>
          <div className="change-animations-list">
            {animations
              .filter((anim) => anim.title !== value)
              .map(({ id, title }) => (
                <div key={id} onClick={onClick(title as AnimationTitle)}>
                  <LottieOption
                    animationData={
                      animationTable[title as AnimationTitle] as any
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectAnimations;
