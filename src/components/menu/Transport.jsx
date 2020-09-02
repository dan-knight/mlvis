import React from 'react';
import { Button } from 'react-bootstrap';

export default function Transport(props) {
  const startButton = () => props.status !== 'complete' ? 
    <Button variant='outline-primary' onClick={props.onStart}>Start</Button> : null;

  const pauseButton = () => <Button variant='outline-primary' onClick={props.onPause}>Pause</Button>;

  const resetButton = () => props.status !== 'clean' ? 
    <Button variant='outline-primary'  onClick={props.onReset}>Reset</Button> : null;

  return (
    <div>
      {props.status !== 'active' ? startButton() : pauseButton()}
      {resetButton()}
    </div>
  );
};