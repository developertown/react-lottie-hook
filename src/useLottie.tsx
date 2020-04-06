import React, { useState, useEffect, useCallback } from "react";
import lottie, { AnimationConfigWithData } from "lottie-web";
import { LottieAnimationItem, AnimationDispatch, LottieConfig, EventListener, LottieState, Renderer } from "./types";

export const useLottie = ({
  renderer = Renderer.html,
  loop = true,
  autoplay = true,
  rendererSettings = {},
  segments = [],
  animationData = {},
  ...props
}: LottieConfig): [
  React.MutableRefObject<HTMLDivElement | null>,
  {
    isStopped: boolean;
    isPaused: boolean;
  },
  AnimationDispatch,
] => {
  const [animation, setAnimation] = useState<LottieAnimationItem | undefined>(undefined);
  const lottieRef = React.useRef<HTMLDivElement | null>(null);
  const [internalAnimationData, setInternalAnimationData] = useState(animationData);
  const [state, dispatch] = useState<LottieState>({
    animationData: animationData,
    isStopped: false,
    isPaused: false,
  });

  const registerEvents = useCallback(
    (eventListeners: EventListener[]) => {
      eventListeners.forEach((eventListener) => {
        animation && animation.addEventListener(eventListener.eventName, eventListener.callback);
      });
    },
    [animation],
  );

  const deRegisterEvents = useCallback(
    (eventListeners: EventListener[]) => {
      eventListeners.forEach((eventListener) => {
        if (animation && animation.removeEventListener) {
          animation.removeEventListener(eventListener.eventName, eventListener.callback);
        }
      });
    },
    [animation],
  );

  const animationConfig: (conatiner: HTMLElement) => AnimationConfigWithData = useCallback(
    (container: HTMLElement) => ({
      container,
      renderer,
      loop,
      autoplay,
      rendererSettings,
      animationData: internalAnimationData,
    }),
    [renderer, loop, autoplay, rendererSettings, internalAnimationData],
  );

  const update = (update: Partial<LottieState>): void => {
    dispatch((state) => ({ ...state, ...update }));
  };

  const controls: AnimationDispatch = {
    ...animation,
    play: useCallback(() => {
      if (animation && animation.play) {
        animation.play();
        update({
          isPaused: false,
          isStopped: false,
        });
      }
    }, [animation]),
    playSegments: useCallback(
      (newSegments, forceFlag = true) => {
        if (animation && animation.playSegments) {
          animation.playSegments(newSegments || segments, forceFlag);
        }
      },
      [animation, segments],
    ),
    stop: useCallback(() => {
      if (animation && animation.stop) {
        animation.stop();
        update({
          isStopped: true,
          isPaused: true,
        });
      }
    }, [animation]),
    pause: useCallback(() => {
      if (animation && animation.pause) {
        animation.pause();
        update({ isPaused: true });
      }
    }, [animation]),
    destroy: useCallback(() => {
      if (animation && animation.destroy) {
        animation.destroy();
      }
    }, [animation]),
    selectAnimation: useCallback(
      (newAnimation) => {
        if (animation) {
          update({
            isStopped: false,
            isPaused: false,
            animationData: newAnimation,
          });
        }
      },
      [animation],
    ),
  };

  useEffect(() => {
    const anim = lottie.loadAnimation(animationConfig(lottieRef.current as HTMLElement));
    setAnimation(anim as LottieAnimationItem);

    if (props.eventListeners) registerEvents(props.eventListeners);

    return (): void => {
      if (animation && animation.destroy) animation.destroy();
      setAnimation(undefined);
      if (props.eventListeners) deRegisterEvents(props.eventListeners);
      controls.destroy();
      update({ animationData: {} });
    };
  }, []);

  useEffect(() => {
    if (internalAnimationData !== state.animationData) {
      if (props.eventListeners) deRegisterEvents(props.eventListeners);
      controls.destroy();

      // TODO: use animationConfig
      const newOptions = {
        renderer,
        loop,
        autoplay,
        rendererSettings,
        animationData: state.animationData,
      };
      setInternalAnimationData(state.animationData);

      const anim = lottie.loadAnimation({
        ...animationConfig(lottieRef.current as HTMLElement),
        ...newOptions,
      });
      setAnimation(anim as LottieAnimationItem);
      if (props.eventListeners) registerEvents(props.eventListeners);
    }
  }, [
    internalAnimationData,
    state.animationData,
    props.eventListeners,
    rendererSettings,
    deRegisterEvents,
    animationConfig,
    registerEvents,
    autoplay,
    renderer,
    controls,
    state,
    loop,
  ]);

  const { isStopped, isPaused } = state;

  return [
    lottieRef,
    {
      isStopped,
      isPaused,
    },
    controls,
  ];
};
