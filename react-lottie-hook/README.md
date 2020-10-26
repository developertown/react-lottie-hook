# react-lottie-hook

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE)
[![npm version](https://img.shields.io/static/v1?label=npm&message=v0.2.0&color=informational)](https://www.npmjs.com/package/react-lottie-hook) 
[![React Version](https://img.shields.io/static/v1?label=react&message=>=16.8.0&color=informational)](https://github.com/facebook/react/blob/master/CHANGELOG.md)
[![React Version](https://img.shields.io/static/v1?label=react&message=17.0.0&color=informational)](https://github.com/facebook/react/blob/master/CHANGELOG.md)
![CI](https://github.com/developertown/react-lottie-hook/workflows/Continuous%20Integration/badge.svg?branch=master)

Lottie react hook with runtime animation controls.

examples: &middot; [github](https://github.com/developertown/react-lottie-hook/examples/react-lottie-hook-ts) &middot; [codesandbox](https://codesandbox.io/s/lottie-with-hooks-ft8dl) &middot;

# Introduction
Lottie is a library for the Web, Android and iOS that parses Adobe After Effects animations through a plugin called bodymovin and exported as JSON; rendering natively on each platform.

# Getting Started
Add it with your prefered package manager:

```
yarn add react-lottie-hook

npm i react-lottie-hook
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

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/JaysQubeXon"><img src="https://avatars1.githubusercontent.com/u/18309230?v=4" width="100px;" alt=""/><br /><sub><b>Noam Gabriel Jacobson</b></sub></a>
    </td>
    <td align="center">
      <a href="https://github.com/abillingsley"><img src="https://avatars2.githubusercontent.com/u/1089907?s=400&u=425b74a95749d8831befd8b33f10b7b2eb355d23&v=4" width="100px;" alt=""/><br /><sub><b>Alex Billingsley</b></sub></a>
    </td>
    <td>
      <a href="https://github.com/ahwelgemoed"><img src="https://avatars1.githubusercontent.com/u/29273599?s=400&v=4" width="100px;" alt=""/><br /><sub><b>Arno (H) Welgemoed</b></sub></a>
    </td>
  </tr>
</table>