import React, { useState, useEffect, useCallback, useMemo } from "react";
import lottie, { AnimationConfigWithData, AnimationItem, AnimationEventName, AnimationDirection } from "lottie-web";
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
import { array, boolean, number, object, string } from "./utils/common";

type UseLottie<T extends Renderer = Renderer.svg> = (
  config: LottieConfig<T>,
) => [React.MutableRefObject<HTMLDivElement | null>, UseLottieState, AnimationDispatch];

export const useLottie: UseLottie = ({
  renderer = Renderer.svg,
  loop = true,
  autoplay = true,
  rendererSettings = {},
  segments = [],
  animationData = {},
  eventListeners = {},
}) => {
  const [animation, setAnimation] = useState<LottieAnimationItem | undefined>(undefined);
  const lottieRef = React.useRef<HTMLDivElement>(null);
  const [internalAnimationData, setInternalAnimationData] = useState(animationData);
  const [state, dispatch] = useState<LottieState>({
    animType: undefined,
    animationID: undefined,
    assets: [],
    assetsPath: undefined,
    autoloadSegments: false,
    autoplay: false,
    currentFrame: 0,
    currentRawFrame: 0,
    firstFrame: 0,
    frameModifier: 0,
    frameMult: 0,
    frameRate: 0,
    initialSegment: undefined,
    isPaused: false,
    isLoaded: false,
    isSubframeEnabled: false,
    loop: undefined,
    name: undefined,
    path: undefined,
    playCount: 0,
    playDirection: 1,
    playSpeed: 0,
    segmentPos: 0,
    segments: [],
    timeCompleted: 0,
    totalFrames: 0,
    isStopped: false,
    animationData: animationData,
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

  const setSpeed = useCallback(
    (speed) => {
      if (hasOwnProperty(animation as LottieAnimationItem, "setSpeed")) {
        animation?.setSpeed(speed);
        update({ playSpeed: speed });
      }
    },
    [animation, hasOwnProperty],
  );

  const resize = useCallback(() => {
    if (hasOwnProperty(animation as LottieAnimationItem, "resize")) {
      animation?.resize();
    }
  }, [animation, hasOwnProperty]);

  const goToAndPlay = useCallback(
    (value, isFrame) => {
      if (hasOwnProperty(animation as LottieAnimationItem, "goToAndPlay")) {
        if (state.totalFrames && value > state.totalFrames) {
          console.error(
            `[goToAndPlay]: provided value ${value} exceeds animation total frames which is ${state.totalFrames}`,
          );
        }
        animation?.goToAndPlay(value, isFrame);
      }
    },
    [animation, hasOwnProperty, state.totalFrames],
  );

  const goToAndStop = useCallback(
    (value, isFrame) => {
      if (hasOwnProperty(animation as LottieAnimationItem, "goToAndStop")) {
        if (state.totalFrames && value > state.totalFrames) {
          console.error(
            `[goToAndStop]: provided value ${value} exceeds animation total frames which is ${state.totalFrames}`,
          );
        }
        animation?.goToAndStop(value, isFrame);
      }
    },
    [animation, hasOwnProperty, state.totalFrames],
  );

  const setSubframe = useCallback(
    (useSubFrames) => {
      if (hasOwnProperty(animation as LottieAnimationItem, "setSubframe")) {
        animation?.setSubframe(useSubFrames);
      }
    },
    [animation, hasOwnProperty],
  );

  const getDuration = useCallback(
    (inFrames): number => {
      if (hasOwnProperty(animation as LottieAnimationItem, "getDuration")) {
        return animation?.getDuration(inFrames) as number;
      }
      return 0;
    },
    [animation, hasOwnProperty],
  );

  const controls: AnimationDispatch = useMemo(
    () => ({
      play,
      stop,
      pause,
      resize,
      destroy,
      setSpeed,
      getDuration,
      setSubframe,
      goToAndPlay,
      goToAndStop,
      playSegments,
      setDirection,
      selectAnimation,
    }),
    [
      play,
      stop,
      pause,
      resize,
      destroy,
      setSpeed,
      getDuration,
      setSubframe,
      goToAndPlay,
      goToAndStop,
      setDirection,
      playSegments,
      selectAnimation,
    ],
  );

  const filterLottieState = useCallback(
    (anim: LottieAnimationItem | LottieState) => {
      const updates = {} as Partial<LottieState>;
      if (string.isPopulated(anim.name)) updates.name = anim.name;
      // eslint-disable-next-line
      // @ts-ignore
      if (string.isPopulated(anim.path)) updates.path = anim.path;
      // eslint-disable-next-line
      // @ts-ignore
      if (array.isPopulated(anim.assets)) updates.assets = anim.assets;
      // eslint-disable-next-line
      // @ts-ignore
      if (string.isPopulated(anim.animType)) updates.animType = anim.animType;
      if (string.isPopulated(anim.assetsPath)) updates.assetsPath = anim.assetsPath;
      if (string.isPopulated(anim.animationID)) updates.animationID = anim.animationID;
      if (number.is(anim.frameMult)) updates.frameMult = anim.frameMult;
      if (number.is(anim.frameRate)) updates.frameRate = anim.frameRate;
      if (number.is(anim.playCount)) updates.playCount = anim.playCount;
      if (number.is(anim.playSpeed)) updates.playSpeed = anim.playSpeed;
      if (number.is(anim.firstFrame)) updates.firstFrame = anim.firstFrame;
      if (number.is(anim.segmentPos)) updates.segmentPos = anim.segmentPos;
      if (number.is(anim.totalFrames)) updates.totalFrames = anim.totalFrames;
      if (number.is(anim.currentFrame)) updates.currentFrame = anim.currentFrame;
      if (number.is(anim.timeCompleted)) updates.timeCompleted = anim.timeCompleted;
      // eslint-disable-next-line
      // @ts-ignore
      if (number.is(anim.frameModifier)) updates.frameModifier = anim.frameModifier;
      if (number.is(anim.playDirection)) updates.playDirection = anim.playDirection as AnimationDirection;
      // eslint-disable-next-line
      // @ts-ignore
      if (number.is(anim.initialSegment)) updates.initialSegment = anim.initialSegment;
      if (number.is(anim.currentRawFrame)) updates.currentRawFrame = anim.currentRawFrame;
      // eslint-disable-next-line
      // @ts-ignore
      if (boolean.is(anim.autoloadSegments)) updates.autoloadSegments = anim.autoloadSegments;
      if (boolean.is(anim.isSubframeEnabled)) updates.isSubframeEnabled = anim.isSubframeEnabled;
      if (boolean.is(anim.isLoaded)) updates.isLoaded = anim.isLoaded;
      if (boolean.is(anim.isPaused)) updates.isPaused = anim.isPaused;
      if (boolean.is(anim.autoplay)) updates.autoplay = anim.autoplay;
      if (boolean.is(anim.loop)) updates.loop = anim.loop;
      if (array.isPopulated(anim.segments)) updates.segments = anim.segments;

      updates.isStopped = state.isStopped;
      return updates;
    },
    [state.isStopped],
  );

  useEffect(() => {
    const anim = lottie.loadAnimation(animationConfig(lottieRef.current as HTMLElement)) as LottieAnimationItem;

    registerEvents(anim, eventListeners);

    const updates = filterLottieState(anim);
    update(updates);

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

      const updates = filterLottieState(anim);
      update(updates);
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
    filterLottieState,
    autoplay,
    renderer,
    controls,
    state,
    loop,
  ]);

  const lottieState = filterLottieState(state);

  return [lottieRef, lottieState, controls];
};
