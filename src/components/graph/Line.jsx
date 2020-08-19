import React from 'react';
 
const Line = React.memo(function(props) {
  function f(x) {
    return props.coefficients.reduce((total, c, i) => {
      return total + (c * x ** i);
    });
  };

  function getD() {
    const startX = props.xPoints[0];
    let d = `M${props.xScale(startX)} ${props.yScale(f(startX))}`;
    
    for (let i = 1; i < props.xPoints.length; i++) {
      const x = props.xPoints[i];
      d += ` L${props.xScale(x)} ${props.yScale(f(x))}`
    };
    
    return d;
  };

  return (
    <path d={getD()} stroke={props.color} fill="none" />
  )
});

export default Line;