import React from 'react';

import { getEqualDivisions } from '../../logic/utility';
 
const Line = React.memo(function(props) {
  function getD() {
    let points = getEqualDivisions(props.xScale.domain(), 1000);
    const startX = points.shift()
    let d = `M${props.xScale(startX)} ${props.yScale(props.f.f(startX))}`;
    
    points.forEach(p => d += ` L${props.xScale(p)} ${props.yScale(props.f.f(p))}`)
    
    return d;
  };

  return (
    <path d={getD()} stroke={props.color} fill="none" />
  )
});

export default Line;