import React from 'react';

const Scatter = React.memo(function(props) {
  return (
    <g fill="red">
      {props.xData.map((d, i) => {
        return (<circle 
          cx={props.xScale(d)}
          cy={props.yScale(props.yData[i])}
          key={i}
          r={2} />)})}
    </g>
  );
});

export default Scatter;