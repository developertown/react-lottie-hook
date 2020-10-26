import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useLottie, Lottie } from 'react-lottie-hook';
import RocketAnimation from './rocket.json';


const App = () => {
  const [lottieRef] = useLottie({
    renderer: "svg",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: false,
    },
    animationData: RocketAnimation
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />f
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Lottie lottieRef={lottieRef} height={200} width={200} />
      </header>
    </div>
  );
}

export default App;
