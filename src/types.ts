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

enum AnimType {
  svg,
  canvas,
  html,
}

type AnimTypes = AnimType.svg | AnimType.canvas | AnimType.html;

type Layer = {
  ddd: number;
  ind: number;
  ty: number;
  nm: string;
  parent?: number;
  ks: { [key: string]: any };
  op: number;
  ip: number;
  bm: number;
  ao: number;
  st: number;
  sr: number;
  shapes: any[];
  completed: boolean;
};

interface Asset {
  id: string;
  layers: Layer[];
}

export interface UseLottieState {
  animType?: AnimTypes;
  animationID?: string;
  assets?: Asset[];
  assetsPath?: string;
  autoloadSegments?: boolean;
  audioController?: AudioController;
  autoplay?: boolean;
  currentFrame?: number;
  currentRawFrame?: number;
  firstFrame?: number;
  frameModifier?: number;
  frameMult?: number;
  frameRate?: number;
  imagePreloader?: ImagePreloader;
  initialSegment?: number;
  isPaused?: boolean;
  isLoaded?: boolean;
  isSubframeEnabled?: boolean;
  loop?: number | boolean;
  name?: string;
  path?: string;
  playCount?: number;
  playDirection?: AnimationDirection;
  playSpeed?: number;
  segmentPos?: number;
  segments?: number[] | AnimationSegment | AnimationSegment[];
  timeCompleted?: number;
  totalFrames?: number;
  isStopped?: boolean;
}

interface ImagePreloader {
  assetsPath: string;
  images: any[];
  imagesLoadedCb: () => void;
  loadedAssets: number;
  path: string;
  totalImages: number;
  _createImageData: () => void;
  _imageLoaded: () => void;
}

interface AudioController {
  audios: any[];
  audioFactory: () => void | undefined;
  _volume: number;
  _isMuted: boolean;
}

export interface AnimationDispatch {
  play(): void;
  stop(): void;
  pause(): void;
  resize(): void;
  destroy(): void;
  setSpeed(speed: number): void;
  setDirection(direction: AnimationDirection): void;
  playSegments(segments: AnimationSegment | AnimationSegment[], forceFlag?: boolean): void;
  selectAnimation: (newAnimation: AnimationConfigWithPath | AnimationConfigWithData) => void;
  goToAndPlay(value: number, isFrame?: boolean): void;
  goToAndStop(value: number, isFrame?: boolean): void;
  setSubframe(useSubFrames: boolean): void;
  getDuration(inFrames?: boolean): number;
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

export interface LottieConfig<T extends Renderer = Renderer.svg> extends Omit<AnimationConfig<T>, "container"> {
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

export interface LottieState extends UseLottieState {
  animationData: AnimationData;
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
