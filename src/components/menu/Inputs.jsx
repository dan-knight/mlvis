import React, { PureComponent } from 'react';
import { ButtonGroup as BootstrapButtonGroup, ToggleButton } from 'react-bootstrap';

class Input extends PureComponent {
  getDisabled() {
    return this.props.status !== 'clean';
  };

  render() {
    return;
  }
}

export class ButtonGroup extends Input {
  render() {
    return (
      <div className="buttonGroup">
        <p>{this.props.label}</p>
        <BootstrapButtonGroup toggle>
          {this.props.options.map((o, i) => (
            <ToggleButton
              key={i}
              data-key={i}
              type="radio"
              variant="outline-primary"
              value={o.value}
              checked={this.props.value === o.value}
              onChange={e => this.props.onChange(this.props.name, e.target.value)}
            >
              {o.text ? o.text : o.value}
            </ToggleButton>
          ))}
        </BootstrapButtonGroup>
      </div>
    );
  };
};

export class Slider extends Input {
  render() {
    return (
      <div>
        <input type='range' className=''
          name={this.props.name} 
          min={this.props.min}
          max={this.props.max}
          value={this.props.value}
          onChange={e => this.props.onChange(e)}
          disabled={this.getDisabled()} />
        <label>{this.props.value}</label>
      </div>
    );
  };
};