import React, { useState, useCallback, MouseEvent } from "react";
import { useLottie, Lottie, ClickAway, EventListener } from "react-lottie-hook";
import {
  animationTable,
  Animation,
  AnimationTitle,
  animations,
} from "./animations";
import "./App.css";
import Button from "./components/Button";
import SelectAnimations from './components/SelectAnimations';

const App = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [animationData] = useState(
    animationTable[Animation["Hallowin Cat"]] as any
  );
  const [selected, setOnSelect] = useState<AnimationTitle>(
    Animation["Hallowin Cat"]
  );

  const eventListeners: EventListener = {
    loopComplete: (data) => console.log("loop completed successfully", data),
    destroy: (data) => console.log("animation destroyed", data),
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

  const onSelect = useCallback((value: AnimationTitle) =>
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.persist();
      setOnSelect(value);
      controls.selectAnimation(animationTable[value] as any);
    },
    [controls]
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
  }, [controls, state.playDirection]);

  const setSpeed = useCallback(() => {
    const speed = state.playSpeed === 1 ? 2 : 1;
    controls.setSpeed(speed);
  }, [state.playSpeed, controls]);

  const resize = useCallback(() => {
    controls.resize();
  }, [controls]);

  const goToAndPlay = useCallback(() => {
    controls.goToAndPlay(100, true);
  }, [controls]);

  const goToAndStop = useCallback(() => {
    controls.goToAndStop(180, true);
  }, [controls]);

  const setSubframe = useCallback(() => {
    controls.setSubframe(false);
  }, [controls]);

  const getDuration = useCallback(() => {
    const duration = controls.getDuration(true);
    console.log("animation duration", duration);
  }, [controls]);

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
      <ClickAway
        onClickAway={clickToPauseAway}
        onClickIn={clickToPause}
        className="clickaway-position"
      >
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
      <Button
        title="toggle direction"
        onClick={toggleAnimationDirection}
        style={{ width: "12.55rem" }}
      />
      <Button
        title={`speed: ${state.playSpeed === 1 ? 2 : 1}`}
        onClick={setSpeed}
        style={{ width: "12.55rem" }}
      />

      <Button title="resize" onClick={resize} />
      <Button title="Jump to 100" onClick={goToAndPlay} />
      <Button title="Jump to 180 and stop" onClick={goToAndStop} />
      <Button title="use sub frames" onClick={setSubframe} />
      <Button title="get duration" onClick={getDuration} />
      <SelectAnimations onClick={onSelect} value={selected} animations={animations} />
    </div>
  );
};

export default App;
