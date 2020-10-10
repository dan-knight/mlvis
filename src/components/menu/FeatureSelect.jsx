import React from 'react';
import { Radio } from './Inputs';

const FeatureSelect = React.memo(function(props) {
  function handleChange(value) {
    props.onChange(value, props.name);
  };

  return <Radio options={props.options} label={props.label} 
    status={props.status} value={props.value} onChange={handleChange} />
});

export default FeatureSelect;