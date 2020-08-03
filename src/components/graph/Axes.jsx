import { Component } from "react";

import React from 'react';

const Axes = React.memo(function(props) {
  return(
    <React.Fragment>
      <XAxis label={props.xLabel} scale={props.scale} />
      <YAxis label={props.yLabel} scale={props.scale} />
    </React.Fragment>
  )
});

export default Axes;

class Axis extends Component {
  fontSize = 1.5;

  getFontSize() {
    return `${this.fontSize}rem`;
  }

  getD() {
    return ''
  };

  getLabelX() {
    return 0;
  };

  getLabelY() {
    return 0;
  };

  getLabelDY() {
    return 0;
  };

  getTransform() {
    return '';
  };

  render() {
    return (
      <React.Fragment>
        <g fill="none" stroke="black">
          <path d={this.getD()}></path>
        </g>
        <text 
          x={this.getLabelX()} y={this.getLabelY()}
          textAnchor="middle" transform={this.getTransform()}
          fontSize={this.getFontSize()} dy={this.getLabelDY()}>
            {this.props.label}</text>
      </React.Fragment>
    );
  };
};

class XAxis extends Axis {
  getD() {
    const startX = this.props.scale.x.range()[0];
    const startY = this.props.scale.y.range()[0];
    const endX = this.props.scale.x.range()[1];
    return `M${startX} ${startY} H${endX}`;
  };

  getLabelX() {
    const range = this.props.scale.x.range()[1] - this.props.scale.x.range()[0];
    const minimum = this.props.scale.x.range()[0];
    return range / 2 + minimum;
  };

  getLabelY() {
    return this.props.scale.y.range()[0];
  };

  getLabelDY() {
    return this.getFontSize();
  }

};

class YAxis extends Axis {
  getD() {
    const startX = this.props.scale.x.range()[0];
    const startY = this.props.scale.y.range()[0];
    const endY = this.props.scale.y.range()[1];
    return `M${startX} ${startY} V${endY}`;
  };

  getLabelX() {
    return this.props.scale.y.range()[0] / 2 * -1
  };

  getLabelY() {
    return this.props.scale.x.range()[0];
  };

  getLabelDY() {
    return `${this.fontSize * -0.5}rem`;
  }

  getTransform() {
    return 'rotate(270)';
  };
}

