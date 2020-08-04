import { Component, PureComponent } from "react";
import React from 'react';

import { getEqualDivisions } from '../../logic/utility';

const Axes = React.memo(function(props) {
  return(
    <React.Fragment>
      <XAxis label={props.xLabel} scale={props.scale}
        tickSize={props.tickSize} fontSize={props.fontSize} />
      <YAxis label={props.yLabel} scale={props.scale}
        tickSize={props.tickSize} fontSize={props.fontSize} />
    </React.Fragment>
  )
});

export default Axes;

class Axis extends Component {
  fontSize = 1.4 * this.props.fontSize;

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

  getTicks() {
    return null;
  }

  render() {
    return (
      <React.Fragment>
        <g fill="none" stroke="black">
          <path d={this.getD()}></path>
        </g>
        <text 
          x={this.getLabelX()} y={this.getLabelY()}
          textAnchor="middle" transform={this.getTransform()}
          fontSize={this.fontSize} dy={this.getLabelDY()}>
            {this.props.label}</text>
          {this.getTicks()}
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
    // return this.props.scale.y.range()[0] + this.props.tickSize + 8;
    return 575;
  };

  getLabelDY() {
    return -0.25 * this.fontSize;
  };

  getTicks() {
    return <XTicks scale={this.props.scale} tickSize={this.props.tickSize} fontSize={this.fontSize} />
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
    return 0;
  };

  getLabelDY() {
    return this.fontSize;
  };

  getTransform() {
    return 'rotate(270)';
  };

  getTicks() {
    return <YTicks scale={this.props.scale} tickSize={this.props.tickSize} fontSize={this.fontSize} />
  }
}

class Ticks extends PureComponent {
  fontSize = 0.6 * this.props.fontSize;

  getDivisions() {
    return [];
  };

  getD(division) {
    return '';
  };

  getTextX(division) {
    return 0;
  };

  getTextY(division) {
    return 0;
  };

  getTextDY() {
    return 0;
  }

  getTextAnchor() {
    return '';
  };

  render() {
    const divisions = this.getDivisions();

    return (
      <React.Fragment>
        <g stroke="black" fill="none">
          {divisions.map(division => {
            return <path d={this.getD(division)}/>
          })}
        </g>
        <g fontSize={this.fontSize} textAnchor={this.getTextAnchor()}>
          {divisions.map(division => {
            return (
              <text 
                x={this.getTextX(division)} 
                y={this.getTextY(division)} dy={this.getTextDY()}>
                  {division.toFixed(1)}
              </text>
            )
          })}
        </g>
      </React.Fragment>
    )
  }
};

class XTicks extends Ticks {
  getDivisions() {
    return getEqualDivisions(this.props.scale.x.domain(), 10);
  }

  getD(division) {
    return `M${this.props.scale.x(division)} ${this.props.scale.y.range()[0]} v${this.props.tickSize}`;
  };

  getTextX(division) {
    return this.props.scale.x(division);
  };

  getTextY(division) {
    return this.props.scale.y.range()[0] + this.props.tickSize;
  };

  getTextDY() {
    return this.fontSize;
  };

  getTextAnchor() {
    return "middle";
  }
};

class YTicks extends Ticks {
  getDivisions() {
    return getEqualDivisions(this.props.scale.y.domain(), 10);
  }

  getD(division) {
    return `M${this.props.scale.x.range()[0]} ${this.props.scale.y(division)} h-${this.props.tickSize}`;
  };

  getTextX(division) {
    return this.props.scale.x.range()[0] - this.props.tickSize - (this.fontSize / 2);
  };

  getTextY(division) {
    return this.props.scale.y(division);
  };

  getTextDY() {
    return this.fontSize / 2
  };

  getTextAnchor() {
    return "end";
  };
};

