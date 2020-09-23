import React, { useState, useEffect, useCallback } from "react";
import lottie, { AnimationConfigWithData, AnimationItem, AnimationEventName } from "lottie-web";
import {
  LottieAnimationItem,
  AnimationDispatch,
  LottieConfig,
  EventListener,
  LottieState,
  Renderer,
  AnimationEventTypes,
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
}: LottieConfig): [
  React.MutableRefObject<HTMLDivElement | null>,
  {
    isStopped: boolean;
    isPaused: boolean;
    isLoaded: boolean;
  },
  AnimationDispatch,
] => {
  const [animation, setAnimation] = useState<LottieAnimationItem | undefined>(undefined);
  const lottieRef = React.useRef<HTMLDivElement>(null);
  const [internalAnimationData, setInternalAnimationData] = useState(animationData);
  const [state, dispatch] = useState<LottieState>({
    animationData: animationData,
    isStopped: false,
    isPaused: false,
    isLoaded: false,
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
      return anim;
    },
    [hasOwnProperty],
  );

  const deRegisterEvents = useCallback(
    (anim: AnimationItem, eventListeners: EventListener) => {
      Object.entries(eventListeners).forEach(([eventName, callback]) => {
        if (hasOwnProperty(anim, "removeEventListener")) {
          anim?.removeEventListener<AnimationEventTypes>(eventName as AnimationEventName, callback);
        }
      });
      return anim;
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

  const controls: AnimationDispatch = {
    ...animation,
    play: useCallback(() => {
      if (hasOwnProperty(animation as LottieAnimationItem, "play")) {
        animation?.play();
        update({
          isPaused: false,
          isStopped: false,
        });
      }
    }, [animation, hasOwnProperty]),
    playSegments: useCallback(
      (newSegments, forceFlag = true) => {
        if (hasOwnProperty(animation as LottieAnimationItem, "playSegments")) {
          animation?.playSegments(newSegments || segments, forceFlag);
        }
      },
      [animation, segments, hasOwnProperty],
    ),
    stop: useCallback(() => {
      if (hasOwnProperty(animation as LottieAnimationItem, "stop")) {
        animation?.stop();
        update({
          isStopped: true,
          isPaused: true,
        });
      }
    }, [animation, hasOwnProperty]),
    pause: useCallback(() => {
      if (hasOwnProperty(animation as LottieAnimationItem, "pause")) {
        animation?.pause();
        update({ isPaused: true });
      }
    }, [animation, hasOwnProperty]),
    destroy: useCallback(() => {
      if (hasOwnProperty(animation as LottieAnimationItem, "destroy")) {
        animation?.destroy();
      }
    }, [animation, hasOwnProperty]),
    selectAnimation: useCallback(
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
    ),
  };

  useEffect(() => {
    let anim: AnimationItem = lottie.loadAnimation(animationConfig(lottieRef.current as HTMLElement));

    if (object.isPopulated(eventListeners)) {
      anim = registerEvents(anim, eventListeners) as AnimationItem;
    }

    update({ isLoaded: anim.isLoaded, isPaused: anim.isPaused });
    setAnimation(anim as LottieAnimationItem);

    return (): void => {
      if (hasOwnProperty(animation as LottieAnimationItem, "destroy")) animation?.destroy();
      if (object.isPopulated(eventListeners)) deRegisterEvents(animation as LottieAnimationItem, eventListeners);
      controls.destroy();
      setAnimation(undefined);
      update({ animationData: {} });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (internalAnimationData !== state.animationData) {
      if (object.isPopulated(eventListeners)) deRegisterEvents(animation as LottieAnimationItem, eventListeners);
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

      if (object.isPopulated(eventListeners)) registerEvents(anim as LottieAnimationItem, eventListeners);

      setAnimation(anim as LottieAnimationItem);
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

  const { isStopped, isPaused, isLoaded } = state;

  return [
    lottieRef,
    {
      isStopped,
      isPaused,
      isLoaded,
    },
    controls,
  ];
};
