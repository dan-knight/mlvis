import React from 'react';

export default function Transport(props) {
  const startButton = () => <button onClick={props.onStart}>Start</button>;

  const pauseButton = () => <button onClick={props.onPause}>Pause</button>;

  const resetButton = () => <button onClick={props.onReset}>Reset</button>

  return (
    <div>
      {startButton()}
      {pauseButton()}
      {resetButton()}
    </div>
  )
};
// States: clean, active, paused, complete