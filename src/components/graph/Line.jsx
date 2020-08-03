import React from 'react';

import { getEqualDivisions } from '../../logic/utility';
 
const Line = React.memo(function(props) {
  function getD() {
    let points = getEqualDivisions(props.scale.x.domain(), 100);
    const startX = points.shift()
    let d = `M${props.scale.x(startX)} ${props.scale.y(props.f(startX))}`;
    
    points.forEach(p => d += ` L${props.scale.x(p)} ${props.scale.y(props.f(p))}`)
    
    return d;
  };

  return (
    <path d={getD()} stroke="black" fill="none" />
  )
});

export default Line;