import React, { PureComponent } from 'react';
import { ButtonGroup as BootstrapButtonGroup, InputGroup, ToggleButton } from 'react-bootstrap';

class Input extends PureComponent {
  getDisabled() {
    return this.props.status !== 'clean';
  };

  render() {
    return;
  };
};

export class Radio extends Input {
  render() {
    return (
      <React.Fragment>
        <h2>{this.props.label}</h2>
        {this.props.options.map((o, i) => (
          <RadioButton label={o}
            checked={this.props.value === o} disabled={this.getDisabled()}
            onClick={this.props.onChange} />
        ))}
      </React.Fragment>
    );
  };
};

function RadioButton(props) {
  function handleClick(event) {
    props.onClick(event.target.value);
  };

  return (
    <div className="mb-3">
      <InputGroup.Radio checked={props.checked} value={props.label} disabled={props.disabled} onClick={handleClick}/>
      <InputGroup.Text className="mx-2">{props.label}</InputGroup.Text>
    </div>
  );
};

export class ButtonGroup extends Input {
  render() {
    return (
      <React.Fragment>
        <p className="mb-1">{this.props.label}</p>
        <BootstrapButtonGroup toggle>
          {this.props.options.map((o, i) => (
            <ToggleButton
              key={i}
              data-key={i}
              type="radio"
              variant="outline-primary"
              value={o.value}
              checked={this.props.value === o.value}
              disabled={this.getDisabled()}
              onChange={e => this.props.onChange(this.props.name, e.target.value)}
            >
              {o.text ? o.text : o.value}
            </ToggleButton>
          ))}
        </BootstrapButtonGroup>
      </React.Fragment>
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