import React from "react";
import {
  AnimationItem,
  AnimationSegment,
  AnimationConfig,
  AnimationConfigWithData,
  AnimationConfigWithPath,
  AnimationDirection,
  AnimationEventName,
  AnimationEventCallback,
} from "lottie-web";

export interface LottieProps {
  lottieRef: React.MutableRefObject<HTMLElement | null>;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  title?: string;
  className?: string;
  ariaRole?: string;
  ariaLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface ClickAwayProps {
  mouseEvent?: "onClick";
  touchEvent?: "onTouchEnd";
  onClickAway: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onClickIn: () => void;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

export interface LottieAnimationItem extends AnimationItem {
  isPaused: boolean;
  isStopped: boolean;
}

export interface AnimationDispatch {
  play(): void;
  stop(): void;
  pause(): void;
  destroy(): void;
  selectAnimation: (newAnimation: AnimationConfigWithPath | AnimationConfigWithData) => void;
  setSpeed?(speed?: number): void;
  setDirection?(direction: AnimationDirection): void;
  resize?(): void;
  goToAndPlay?(value: number, isFrame?: boolean): void;
  goToAndStop?(value: number, isFrame?: boolean): void;
  playSegments?(segments: AnimationSegment | AnimationSegment[], forceFlag?: boolean): void;
  setSubframe?(useSubFrames: boolean): void;
  getDuration?(inFrames?: boolean): number;
  // eslint-disable-next-line
  addEventListener?<T = AnimationEventTypes>(name: AnimationEventName, callback: AnimationEventCallback<T>): void;
  // eslint-disable-next-line
  removeEventListener?<T = AnimationEventTypes>(name: AnimationEventName, callback: AnimationEventCallback<T>): void;
}

export interface LottieOptions extends AnimationConfigWithData {
  segments: AnimationSegment | AnimationSegment[];
}

export enum Renderer {
  html = "html",
  svg = "svg",
  canvas = "canvas",
}

export type AnimationData = AnimationConfigWithPath | AnimationConfigWithData | Record<string, unknown>;

export interface LottieConfig extends Omit<AnimationConfig, "container"> {
  title?: string;
  options?: LottieOptions;
  eventListeners?: EventListener;
  direction?: 1 | -1 | number;
  speed?: number;
  segments?: AnimationSegment | AnimationSegment[];
  animationData?: AnimationData;
}

// eslint-disable-next-line
export type EventListener<T = any> = {
  /** Use when LottieConfig.loop is set to false */
  complete?: AnimationEventCallback<BMCompleteEvent>;
  /** Triggered when animation is destroyed */
  destroy?: AnimationEventCallback<BMDestroyEvent>;
  /** Use when LottieConfig.loop is set to true */
  loopComplete?: AnimationEventCallback<BMCompleteLoopEvent>;
  /** Triggered on every frame */
  enterFrame?: AnimationEventCallback<BMEnterFrameEvent>;
  segmentStart?: AnimationEventCallback<BMSegmentStartEvent>;
  config_ready?: AnimationEventCallback<T>;
  data_ready?: AnimationEventCallback<T>;
  data_failed?: AnimationEventCallback<T>;
  DOMLoaded?: AnimationEventCallback;
  error?: AnimationEventCallback<T>;
  loaded_images?: AnimationEventCallback<T>;
};

export interface LottieState {
  animationData: AnimationData;
  isStopped: boolean;
  isPaused: boolean;
  isLoaded: boolean;
}

type BMEventType<T = string> = {
  type: T;
};

export interface BMCompleteEvent extends BMEventType<"complete"> {
  direction: number;
}

export interface BMCompleteLoopEvent extends BMEventType<"loopComplete"> {
  currentLoop: number;
  direction: number;
  totalLoops: boolean;
}

export interface BMEnterFrameEvent extends BMEventType<"enterFrame"> {
  currentTime: number;
  direction: number;
  totalTime: boolean;
}

export interface BMDestroyEvent extends BMEventType<"destroy"> {
  target: AnimationItem;
}

export interface BMSegmentStartEvent extends BMEventType<"BMSegmentStartEvent"> {
  firstFrame: number;
  totalFrames: number;
}

export interface BMRenderFrameErrorEvent extends BMEventType<"renderFrameError"> {
  nativeError: Error;
  currentTime: number;
}

export interface BMConfigErrorEvent extends BMEventType<"configError"> {
  nativeError: Error;
}

export interface BMAnimationConfigErrorEvent extends BMEventType {
  nativeError: Error;
  currentTime: number;
}

export type AnimationEventTypes =
  | BMCompleteEvent
  | BMCompleteLoopEvent
  | BMEnterFrameEvent
  | BMDestroyEvent
  | BMRenderFrameErrorEvent
  | BMConfigErrorEvent
  | BMAnimationConfigErrorEvent
  // eslint-disable-next-line
  | any;
