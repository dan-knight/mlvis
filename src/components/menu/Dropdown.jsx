import React from 'react';

export default function Dropdown(props) {
  return (
    <select 
      name={props.name} 
      value={props.value}
      onChange={e => props.onChange(e)} >
      {props.options.map(o => <option value={o.value}>{o.text}</option>)}
    </select>
  );
};