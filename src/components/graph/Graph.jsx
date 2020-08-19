import React, { PureComponent } from 'react';

import { getMax, getEqualDivisions } from '../../logic/utility';
import Scatter from './Scatter';
import Line from './Line';
import Axes from './Axes';

import memoize from 'memoize-one';
const d3 = require('d3-scale');

export default class Graph extends PureComponent {
  fontSize = 16;
  tickSize = 5;
  getXScale = memoize((data, width) => {
    return d3.scaleLinear()
      .domain([0, getMax(data) * 1.1])
      .range([width - 825, width -25]);
  });

  getYScale = memoize(data => {
    return d3.scaleLinear()
      .domain([0, getMax(data) * 1.1])
      .range([475, 25]);
  });

  getXLinePoints = memoize(xScale => getEqualDivisions(xScale.domain(), 1000));

  render() {
    const xScale = this.getXScale(this.props.xData, this.props.width);
    const yScale = this.getYScale(this.props.yData);
    const xLinePoints = this.getXLinePoints(xScale);

    return (
      <svg 
        viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        style={{'background': '#F0F0F0'}}>
        {this.props.lines.map((l, i) => {
          return <Line 
            coefficients={l.theta} key={i}
            xScale={xScale} yScale={yScale} 
            xPoints={xLinePoints} color="lightblue" />
        })}
        <Scatter 
          xData={this.props.xData}
          yData={this.props.yData}
          xScale={xScale}
          yScale={yScale} />
        <Axes 
          xLabel={'Sepal Width'} yLabel={'Sepal Length'} 
          xScale={xScale} yScale={yScale}
          tickSize={this.tickSize} fontSize={this.fontSize} />
      </svg>
    );
  };
};
