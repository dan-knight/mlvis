import React from 'react';

export default function Dropdown(props) {
  return (
    <select 
      name={props.name} 
      value={props.value}
      onChange={e => props.onChange(e)} >
      {props.options.map((o, i) => (
        <option 
          value={o.value} 
          key={i}>
            {o.text}
        </option>))}
    </select>
  );
};