import React, { useState, useEffect, useCallback, useMemo } from "react";
import lottie, { AnimationConfigWithData, AnimationItem, AnimationEventName } from "lottie-web";
import {
  LottieAnimationItem,
  AnimationDispatch,
  LottieConfig,
  EventListener,
  LottieState,
  Renderer,
  AnimationEventTypes,
  UseLottieState,
} from "./types";
import { object } from "./utils/common";

export const useLottie = ({
  renderer = Renderer.html,
  loop = true,
  autoplay = true,
  rendererSettings = {},
  segments = [],
  animationData = {},
  eventListeners = {},
}: LottieConfig): [React.MutableRefObject<HTMLDivElement | null>, UseLottieState, AnimationDispatch] => {
  const [animation, setAnimation] = useState<LottieAnimationItem | undefined>(undefined);
  const lottieRef = React.useRef<HTMLDivElement>(null);
  const [internalAnimationData, setInternalAnimationData] = useState(animationData);
  const [state, dispatch] = useState<LottieState>({
    animationData: animationData,
    isStopped: false,
    isPaused: false,
    isLoaded: false,
    playDirection: 1,
  });

  const hasOwnProperty = useCallback(
    (anim: AnimationItem, prop: keyof AnimationItem) => object.isPopulated(anim) && !!anim[prop],
    [],
  );

  const registerEvents = useCallback(
    (anim: AnimationItem, eventListeners: EventListener) => {
      if (!object.isPopulated(eventListeners)) return;
      Object.entries(eventListeners).forEach(([eventName, callback]) => {
        if (hasOwnProperty(anim, "addEventListener") && callback !== undefined) {
          anim?.addEventListener<AnimationEventTypes>(eventName as AnimationEventName, callback);
        }
      });
    },
    [hasOwnProperty],
  );

  const deRegisterEvents = useCallback(
    (anim: AnimationItem, eventListeners: EventListener) => {
      if (!object.isPopulated(eventListeners)) return;
      Object.entries(eventListeners).forEach(([eventName, callback]) => {
        if (hasOwnProperty(anim, "removeEventListener")) {
          anim?.removeEventListener<AnimationEventTypes>(eventName as AnimationEventName, callback);
        }
      });
    },
    [hasOwnProperty],
  );

  const animationConfig: (container: HTMLElement) => AnimationConfigWithData = useCallback(
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

  const play = useCallback(() => {
    if (hasOwnProperty(animation as LottieAnimationItem, "play")) {
      animation?.play();
      update({
        isPaused: false,
        isStopped: false,
      });
    }
  }, [animation, hasOwnProperty]);

  const playSegments = useCallback(
    (newSegments, forceFlag = true) => {
      if (hasOwnProperty(animation as LottieAnimationItem, "playSegments")) {
        animation?.playSegments(newSegments || segments, forceFlag);
      }
    },
    [animation, segments, hasOwnProperty],
  );

  const stop = useCallback(() => {
    if (hasOwnProperty(animation as LottieAnimationItem, "stop")) {
      animation?.stop();
      update({
        isStopped: true,
        isPaused: true,
      });
    }
  }, [animation, hasOwnProperty]);

  const pause = useCallback(() => {
    if (hasOwnProperty(animation as LottieAnimationItem, "pause")) {
      animation?.pause();
      update({ isPaused: true });
    }
  }, [animation, hasOwnProperty]);

  const destroy = useCallback(() => {
    if (hasOwnProperty(animation as LottieAnimationItem, "destroy")) {
      animation?.destroy();
    }
  }, [animation, hasOwnProperty]);

  const setDirection = useCallback(
    (direction = 1) => {
      if (hasOwnProperty(animation as LottieAnimationItem, "setDirection")) {
        animation?.setDirection(direction);
        update({ playDirection: direction });
      }
    },
    [animation, hasOwnProperty],
  );

  const selectAnimation = useCallback(
    (newAnimation) => {
      if (object.isPopulated(animation) && object.isPopulated(newAnimation)) {
        update({
          isStopped: false,
          isPaused: false,
          animationData: newAnimation,
        });
      }
    },
    [animation],
  );

  const controls: AnimationDispatch = useMemo(
    () => ({
      ...animation,
      play,
      playSegments,
      stop,
      pause,
      destroy,
      setDirection,
      selectAnimation,
    }),
    [animation, play, playSegments, stop, pause, destroy, setDirection, selectAnimation],
  );

  useEffect(() => {
    const anim = lottie.loadAnimation(animationConfig(lottieRef.current as HTMLElement)) as LottieAnimationItem;

    registerEvents(anim, eventListeners);

    update({ isLoaded: anim.isLoaded, isPaused: anim.isPaused });
    setAnimation(anim);

    return (): void => {
      if (hasOwnProperty(animation as LottieAnimationItem, "destroy")) animation?.destroy();
      deRegisterEvents(animation as LottieAnimationItem, eventListeners);
      controls.destroy();
      setAnimation(undefined);
      update({ animationData: {} });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // When the animation object is changed:
    if (internalAnimationData !== state.animationData) {
      deRegisterEvents(animation as LottieAnimationItem, eventListeners);
      controls.destroy();

      const newOptions = {
        ...animationConfig(lottieRef.current as HTMLElement),
        renderer,
        loop,
        autoplay,
        rendererSettings,
        animationData: state.animationData,
      };

      const anim = lottie.loadAnimation(newOptions) as LottieAnimationItem;

      registerEvents(anim, eventListeners);

      setInternalAnimationData(state.animationData);
      setAnimation(anim);
    }
  }, [
    animation,
    internalAnimationData,
    state.animationData,
    eventListeners,
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

  const { isStopped, isPaused, isLoaded, playDirection } = state;

  return [
    lottieRef,
    {
      isStopped,
      isPaused,
      isLoaded,
      playDirection,
    },
    controls,
  ];
};
