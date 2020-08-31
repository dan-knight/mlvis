import React, { PureComponent } from 'react';

class Input extends PureComponent {
  getDisabled() {
    return this.props.status !== 'clean';
  };

  render() {
    return;
  }
}

export class Dropdown extends Input {
  render() {
    return (
      <select 
        name={this.props.name} 
        value={this.props.value}
        onChange={e => this.props.onChange(e)}
        disabled={this.getDisabled()} >
        {this.props.options.map((o, i) => (
          <option 
            value={o.value} 
            key={i}>
              {o.text}
          </option>))}
      </select>
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