import React from 'react';

import { ButtonGroup, Slider } from './Inputs';

const Menu = React.memo(function(props) {
  return (
    <div>
      {[
        {
          name: 'maxIter',
          label: 'Maximum Iterations',
          options: [
            { value: '1000' },
            { value: '100' },
            { value: '10' }
          ]
        },
        {
          name: 'learningRate',
          label: 'Learning Rate',
          options: [
            { value: '1' },
            { value: '0.1' },
            { value: '0.01' }
          ]
        },
        {
          name: 'precision',
          label: 'Precision Threshold',
          options: [
            { value: '0.001' },
            { value: '0.0001' },
            { value: '0.00001' }
          ]
        }
      ].map((d, i) => (
        <ButtonGroup 
          name={d.name}
          label={d.label}
          options={d.options}
          value={props.stateSettings[d.name]}
          onChange={props.onChange}
          status={props.status}
          key={i} />))}
      <Slider 
        name='intervalLength'
        min={1000}
        max={10000}
        value={props.stateSettings.intervalLength}
        onChange={props.onChange}
        status={props.status} />
    </div>
  );
});

export default Menu;