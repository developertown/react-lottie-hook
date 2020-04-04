# react-lottie-hook

Lottie react hook with runtime animation controls.

# Introduction
Lottie is a library for the Web, Android and iOS that parses Adobe After Effects animations through a plugin called bodymovin and exported as JSON; rendering natively on each platform.

This library supports react `=^16.8.0` and is written in typescript.

# Getting Started
Get the node module:

`yarn add react-lottie-hook`

or

`npm i react-lottie-hook`

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
    animationData
  })
  
  return <Lottie lottieRef={ref} width={400} height={400} />
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