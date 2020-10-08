# react-lottie-hook

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![npm version](https://img.shields.io/static/v1?label=npm&message=v0.1.1&color=informational)](https://www.npmjs.com/package/react-lottie-hook) [![React Version](https://img.shields.io/static/v1?label=react&message=>=16.8.0&color=informational)](https://github.com/facebook/react/blob/master/CHANGELOG.md) ![CI](https://github.com/developertown/react-lottie-hook/workflows/Continuous%20Integration/badge.svg?branch=master)

Lottie react hook with runtime animation controls.

examples: &middot; [github](https://github.com/JaysQubeXon/react-lottie-hook-demo) &middot; [codesandbox](https://codesandbox.io/s/lottie-with-hooks-ft8dl) &middot;

# Introduction
Lottie is a library for the Web, Android and iOS that parses Adobe After Effects animations through a plugin called bodymovin and exported as JSON; rendering natively on each platform.

# Getting Started
Choose your package manager:

```
➜  yarn add react-lottie-hook
----------- OR --------------
➜  npm i react-lottie-hook
```

# Usage Instructions

This library main exports a `useLottie` hook and supplies also a standard `Lottie` component but you are not required to use the latter.

The `useLottie` hook requires a configuration object of type `LottieConfig` to be supplied to it and in return you will get an array with a **ref** to the animation container, **state** of the animation and the **control** actions, respectively. 

```javascript
import React from 'react';
import { useLottie, Lottie } from "react-lottie-hook";
import animationData from "./animation.json";

const App = () => {
  const [lottieRef, { isPaused, isStopped }, controls] = useLottie({
    renderer: "svg",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: false,
    },
    animationData,
  });
  
  return <Lottie lottieRef={ref} width={400} height={400} />;
}
```

The exported `Lottie` component has a type of `LottieProps` and the minimum props it requires is a `lottieRef` from the `useLottie` hook.

Lottie Component props:

| props | type | default |
| ---- | ---- | ---- |
| lottieRef: | React.MutableRefObject<HTMLElement \| null> | | 
| width? | number | 200px |
| height?| number | 200px |
| style? | object | |
| title? | string | |
| className? | string | |
| ariaRole? | string | |
| ariaLabel? | string | |
| onKeyDown? | (e: React.KeyboardEvent) => void | |
| onClick? | (e: React.MouseEvent<HTMLElement, MouseEvent>) | |


--------------------------------
EventListeners:
--------------------

Among the options you can pass `useLottie` is an `eventListeners` object as follows:

```javascript
const eventListeners: EventLisener = {
  /** triggered only if loop is set to true */
  loopCompleted: (data) => { console.log('Animation Loop Completed'); },
  /** triggered when animation is destroyed */
  destroy: : (data) => { console.log('Animation Destroyed'); },
  /** triggered when loop is set to false */
  complete: (data) => { console.log('Animation Complete'); },
};

const [lottieRef, { isPaused, isStopped }, controls] = useLottie({
  renderer: "svg",
  loop: false, // default true
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
    progressiveLoad: false,
  },
  animationData,
  eventListeners,
});

```
