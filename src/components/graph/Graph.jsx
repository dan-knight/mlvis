import React, { PureComponent } from 'react';

import { getMaxAttribute } from '../../logic/utility';
import Scatter from './Scatter';
import Line from './Line';

const d3 = require('d3-scale');

export default class Graph extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      scale: calcScales(this.props.data, 'sepal_width', 'sepal_length', this.props.width)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return (nextProps.data !== prevState.data) ? 
      { scale: calcScales(nextProps.data, 'sepal_width', 'sepal_length', nextProps.width) } : null;
  }

  render() {
    return (
      <svg 
        viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        style={{'background': '#F0F0F0'}}>
        <Line scale={this.state.scale} f={x => x ** 2}/>
        <Scatter 
          data={this.props.data}
          scale={this.state.scale}
          xColumn={'sepal_width'}
          yColumn={'sepal_length'} />
      </svg>
    )
  }
}

function calcScales(data, xColumn, yColumn, width) {
  return {
    x: d3.scaleLinear().domain([0, getMaxAttribute(data, xColumn) * 1.1]).range([width - 800, width]),
    y: d3.scaleLinear().domain([0, getMaxAttribute(data, yColumn) * 1.1]).range([450, 0])
  }
}