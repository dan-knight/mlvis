import React from 'react';

const Scatter = React.memo(function(props) {
  return (
    <g fill="red">
      {props.data.map(d => {
        return (<circle 
          cx={props.scale.x(d[props.xColumn])}
          cy={props.scale.y(d[props.yColumn])}
          r={2} />)})}
    </g>
  )
})

export default Scatter;