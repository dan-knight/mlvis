import React, { PureComponent } from 'react';

import { getMaxAttribute } from '../../logic/utility';
import Scatter from './Scatter';

const d3 = require('d3-scale');

export default class Graph extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      scale: calcScales(this.props.data, 'sepal_width', 'sepal_length')
    }
  }

  

  static getDerivedStateFromProps(nextProps, prevState) {
    return (nextProps.data !== prevState.data) ? { scale: calcScales(nextProps.data, 'sepal_width', 'sepal_length') } : null;
  }

  render() {
    return (
      <svg 
        viewBox="0 0 800 450"
        style={{'background': '#F0F0F0'}}>
        <Scatter 
          data={this.props.data}
          scale={this.state.scale}
          xColumn={'sepal_width'}
          yColumn={'sepal_length'} />
      </svg>
    )
  }
}

function calcScales(data, xColumn, yColumn) {
  return {
    x: d3.scaleLinear().domain([0, getMaxAttribute(data, xColumn) * 1.1]).range([0, 800]),
    y: d3.scaleLinear().domain([0, getMaxAttribute(data, yColumn) * 1.1]).range([450, 0])
  }
}