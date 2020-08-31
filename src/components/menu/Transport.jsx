import React from 'react';

export default function Transport(props) {
  const startButton = () => props.status !== 'complete' ? <button onClick={props.onStart}>Start</button> : null;

  const pauseButton = () => <button onClick={props.onPause}>Pause</button>;

  const resetButton = () => props.status !== 'clean' ? <button onClick={props.onReset}>Reset</button> : null;

  return (
    <div>
      {props.status !== 'active' ? startButton() : pauseButton()}
      {resetButton()}
    </div>
  );
};