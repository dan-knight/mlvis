import React from 'react';

export default function Slider(props) {
  return (
    <div>
      <input type='range' 
        name={props.name} 
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={e => props.onChange(e)} />
      <label>{props.value}</label>
    </div>
  )
};