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
  style?: object;
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
  triggerEvent?<T = any>(name: AnimationEventName, args: T): void;
  addEventListener?<T = any>(name: AnimationEventName, callback: AnimationEventCallback<T>): void;
  removeEventListener?<T = any>(name: AnimationEventName, callback: AnimationEventCallback<T>): void;
}

export interface LottieOptions extends AnimationConfigWithData {
  segments: AnimationSegment | AnimationSegment[];
}

export enum Renderer {
  html = "html",
  svg = "svg",
  canvas = "canvas",
}

export interface LottieConfig extends Omit<AnimationConfig, "container"> {
  title?: string;
  options?: LottieOptions;
  eventListeners?: EventListener[];
  direction?: 1 | -1 | number;
  speed?: number;
  segments?: AnimationSegment | AnimationSegment[];
  animationData?: AnimationConfigWithPath | AnimationConfigWithData | {};
}

export type EventListener<T = any> = {
  eventName: AnimationEventName;
  callback: AnimationEventCallback<T>;
};

export interface LottieState {
  animationData: AnimationConfigWithPath | AnimationConfigWithData | {};
  isStopped: boolean;
  isPaused: boolean;
}
