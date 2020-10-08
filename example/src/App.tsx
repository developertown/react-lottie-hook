import React, { useState, useCallback } from "react";
import { useLottie, Lottie, ClickAway, EventListener } from "react-lottie-hook";
import { animationTable, Animation, AnimationTitle, animations } from "./animations";
import "./App.css";

const App = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [animationData] = useState(animationTable[Animation.Spinner] as any);
  const [selected, setOnSelect] = useState<AnimationTitle>(Animation.Spinner);

  const eventListeners: EventListener = {
    loopComplete: (data) => console.log('loop completed successfully', data),
    destroy: (data) => console.log('animation destroyed', data),
  };

  const [lottieRef, state, controls] = useLottie({
    renderer: "svg",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: false,
    },
    animationData,
    eventListeners,
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
      controls.selectAnimation(animationTable[value] as any);
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

  const toggleAnimationDirection = useCallback(() => {
    controls.setDirection(state.playDirection === 1 ? -1 : 1);
  }, [controls, state.playDirection])

  return (
    <div className="App">
      <h1>
        Hello,&nbsp;
        <a
          className="App-link"
          href="https://github.com/JaysQubeXon/react-lottie-hook"
          target="_blank"
          rel="noopener noreferrer"
        >
          react-lottie-hook
        </a>
      </h1>
      <ClickAway onClickAway={clickToPauseAway} onClickIn={clickToPause} className='clickaway-position'>
        <Lottie lottieRef={lottieRef} height={200} width={200} />
      </ClickAway>

      <div className="controls">
        <Button title="stop" onClick={onStop} />
        {state.isPaused || state.isStopped ? (
          <Button title="play" onClick={onPlay} />
        ) : (
          <Button title="pause" onClick={onPause} />
        )}
      </div>
      <Button title='toggle direction' onClick={toggleAnimationDirection}  style={{ width: '12rem' }}/>
      <Select onChange={onSelect} value={selected} animations={animations} />
    </div>
  );
};

interface SelectProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  animations: { id: number; title: string }[];
}

const Select: React.FC<SelectProps> = ({ onChange, value, animations }) => {
  return (
    <select name="aniamtions" onChange={onChange} value={value}>
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
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ onClick, title, style }) => {
  const buttonStyle = {
    display: "block",
    margin: "10px auto",
    ...(style ? style : {}),
  };
  return (
    <button className="controls-button" style={buttonStyle} onClick={onClick}>
      {title}
    </button>
  );
};

export default App;
