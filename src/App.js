import React, { Component } from 'react';

import Graph from './components/graph/Graph';

import { importCSV, getBlankData } from './logic/importData';
import { getNewModel, fitLine } from './logic/gradientDescent';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      data: getBlankData(),
      model: getNewModel()
    }
  }

  async importData(filename) {
    this.setState({ data: await importCSV(filename) });
  }

  async componentDidMount() {
    const data = await importCSV('iris');
    const model = getNewModel(
      data.getSeries('sepal_width'), 1,
      data.getSeries('sepal_length'));

    this.setState({
      data: data,
      model: model
    });
  };

  handleFitLine() {
    let model = {...this.state.model}
    fitLine(model)
    this.setState({ model: model})
  }

  render() {
    return (
      <React.Fragment>
        {/* <div style={{"maxWidth": "900px"}}>
          <Graph width="925" height="575"
          xData={this.state.model.xData.getSeries('1').toArray()}
          yData={this.state.model.yData.toArray()}
          lines={this.state.model.predictions.map(p => {
            return (x) => p.reduce((total, theta, i) => {
              return total + (theta * x ** i)}, 0);
          })} />     
        </div> */}
        <button onClick={() => this.handleFitLine()}>Fit Line</button>
      </React.Fragment>
    )
  }
}
