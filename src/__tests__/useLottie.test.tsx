import { render, act, fireEvent } from "@testing-library/react";
import React, { useState, useCallback } from "react";
import { useLottie } from "../useLottie";
import { Lottie } from "../Lottie";
import { ClickAway } from "../ClickAway";

import github from "./animations/github.json";
import spinner from "./animations/spinner.json";
import { Renderer } from "..";

export enum Animation {
  Github = "Github",
  Spinner = "Spinner",
}

export type AnimationTitle = keyof typeof Animation;

export interface AnimationData {
  id: string;
  title: AnimationTitle;
}

export const animations = [
  {
    id: 0,
    title: Animation.Github,
  },
  {
    id: 1,
    title: Animation.Spinner,
  },
];

export const animationTable = {
  [Animation.Github]: github,
  [Animation.Spinner]: spinner,
};

const formTestId = (type: string) => `animation-${type}-test-id`;

const Component = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [animationData] = useState(animationTable[Animation.Github] as any);
  const [selected, setOnSelect] = useState<AnimationTitle>(Animation.Github);

  const [lottieRef, state, controls] = useLottie({
    renderer: Renderer.svg,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: false,
    },
    animationData,
  });

  const onPlay = useCallback(() => {
    controls.play();
  }, [controls]);

  const onPause = useCallback(() => {
    controls.pause();
  }, [controls]);

  const onStop = useCallback(() => {
    controls.stop();
  }, [controls]);

  const onSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      e.persist();
      const value = e.target.value as AnimationTitle;
      setOnSelect(value);
      // @ts-ignore
      controls.selectAnimation(animationTable[value]);
    },
    [controls],
  );

  const clickToPause = useCallback(() => {
    setClicked(true);
    if (state.isPaused) controls.play();
    if (!state.isPaused) controls.pause();
  }, [state.isPaused, controls]);

  const clickToPauseAway = useCallback(() => {
    if (clicked) {
      setClicked(false);
      if (state.isPaused) controls.play();
      if (!state.isPaused) controls.pause();
    }
  }, [state.isPaused, controls, clicked]);

  return (
    <>
      <ClickAway onClickAway={clickToPauseAway} onClickIn={clickToPause}>
        <Lottie lottieRef={lottieRef} height={200} width={200} />
      </ClickAway>

      <div className="controls">
        <Button title="stop" onClick={onStop} dataTestId={formTestId("stop")} />
        {state.isPaused || state.isStopped ? (
          <Button title="play" onClick={onPlay} dataTestId={formTestId("play")} />
        ) : (
          <Button title="pause" onClick={onPause} dataTestId={formTestId("pause")} />
        )}
      </div>
      <Select onChange={onSelect} value={selected} animations={animations} dataTestId={formTestId("select")} />
    </>
  );
};

interface SelectProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  animations: { id: number; title: string }[];
  dataTestId: string;
}

const Select: React.FC<SelectProps> = ({ onChange, value, animations, dataTestId }) => {
  return (
    <select name="aniamtions" onChange={onChange} value={value} data-testid={dataTestId}>
      {animations.map(({ id, title }) => (
        <option key={id} value={title}>
          {title}
        </option>
      ))}
    </select>
  );
};

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  dataTestId: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, title, dataTestId }) => {
  const buttonStyle = {
    display: "block",
    margin: "10px auto",
  };
  return (
    <button style={buttonStyle} onClick={onClick} data-testid={dataTestId}>
      {title}
    </button>
  );
};

describe("useLottie", () => {
  it("renders without crashing", () => {
    const { container } = render(<Component />);
    expect(container).not.toBeNull();
  });
  
  it("Pause, Play and Stop controls work correctly", async () => {
    const { getByTestId, queryByTestId } = render(<Component />);
    // loop is true by default so animation is playing and pause option is displayed:
    const pauseTestId = formTestId("pause");
    const pauseButton = getByTestId(pauseTestId);
    expect(pauseButton).toBeInTheDocument();
    
    const playTestId = formTestId("play");
    const playButton = queryByTestId(playTestId);
    expect(playButton).not.toBeInTheDocument();
    
    const stopButton = getByTestId(formTestId("stop"));
    expect(stopButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(stopButton);
    });
    expect(queryByTestId(pauseTestId)).not.toBeInTheDocument();
    expect(getByTestId(playTestId)).toBeInTheDocument();
  });

  it("an alternative animation can be selected", async () => {
    const { getByTestId } = render(<Component />);
    const selectTestId = getByTestId(formTestId("select"));
    expect(selectTestId).toHaveValue(Animation.Github);
    await act(async () => {
      fireEvent.change(selectTestId, { target: { value: Animation.Spinner }});
    });
    expect(selectTestId).toHaveValue(Animation.Spinner);
  });
});
