import React from 'react';

import Dropdown from './Dropdown';
import Slider from './Slider';

const Menu = React.memo(function(props) {
  return (
    <div>
      {[
        {
          name: 'maxIter',
          options: [
            { text: 1000 },
            { text: 100 },
            { text: 10 }
          ]
        },
        {
          name: 'learningRate',
          options: [
            { text: 1 },
            { text: 0.1 },
            { text: 0.01 }
          ]
        },
        {
          name: 'precision',
          options: [
            { text: 0.001 },
            { text: 0.0001 },
            { text: 0.00001 }
          ]
        }
      ].map((d, i) => (
        <Dropdown 
          name={d.name}
          options={d.options}
          value={props.stateSettings[d.name]}
          onChange={props.onChange}
          key={i} />))}
      <Slider 
        name='intervalLength'
        min={1000}
        max={10000}
        value={props.stateSettings.intervalLength}
        onChange={props.onChange} />
    </div>
  );
});

export default Menu;