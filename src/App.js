import React, { Component } from 'react';

import Graph from './components/graph/Graph';
import Transport from './components/transport/Transport';
import Menu from './components/menu/Menu';

import { importCSV, getBlankData } from './logic/importData';
import { getNewModel, predict } from './logic/gradientDescent';
import { matrixMultiply } from './logic/linearAlgebra';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      data: getBlankData(),
      model: getNewModel(),
      predictions: [],
      status: 'clean',
      iter: 0,
      settings: {
        maxIter: 1000,
        learningRate: 1,
        precision: 0.001,
        intervalLength: 1000
      }
    };
  };

  async importData(filename) {
    this.setState({ data: await importCSV(filename) });
  };

  async componentDidMount() {
    const data = await importCSV('iris');
    const model = getNewModel(
      data.getSeries('sepal_width'), 1,
      data.getSeries('sepal_length'));

    this.setState({
      data: data,
      model: model,
      predictions: []
    });
  };

  componentDidUpdate() {
    switch (this.state.status) {
      case 'active':
        this.fitLine();
        break;
      case 'complete':
        break;
    };
  };

  fitLine = () =>  {
    this.state.iter < this.state.settings.maxIter ? this.gradientDescent() : this.setState({ status: 'complete' });
  };

  gradientDescent() {
    const prevPrediction = this.state.predictions[this.state.predictions.length - 1];

    const getNewTheta = () => {
      const regressionTerm = matrixMultiply(prevPrediction.errors, this.state.model.transposeX);

      return prevPrediction.theta.map((prevTheta, i) => (
        prevTheta - ((this.state.settings.learningRate / this.state.model.m) * regressionTerm.at(i)[0]))
      );
    };

    const newPrediction = predict(this.state.model, getNewTheta())
    const predictions = [...this.state.predictions, newPrediction];
    
    const costDelta = (prevPrediction.cost - newPrediction.cost) / prevPrediction.cost;

    setTimeout(() => {
      this.setState({
        predictions: predictions,
        iter: this.state.iter + 1
      });

      if (costDelta < this.state.settings.precision) { this.setState({ status: 'complete' }) };
    }, this.state.settings.intervalLength * costDelta);
  };

  handleStart = () => {
    if (this.state.status === 'clean') {
      const initialTheta = new Array(this.state.model.n).fill(0);

      this.setState({
        predictions: [predict(this.state.model, initialTheta)],
        iter: 1
      });
    };

    this.setState({
      status: 'active',
    });
  };

  handlePause = () => {
    this.setState({
      status: 'paused'
    });
  };

  handleReset = () => {
    this.setState({ 
      status: 'clean',
      iter: 0,
      predictions: []
    });
  };

  handleChangeSetting = event => {
    this.setState({settings: {
      ...this.state.settings,
      [event.target.name]: event.target.value
    }})
    // console.log(event.target.name)
  }

  render() {
    return (
      <React.Fragment>
        <div style={{"maxWidth": "900px"}}>
          <Graph width="925" height="575"
          xData={this.state.model.xData.getSeries('1').toArray()}
          yData={this.state.model.yData.toArray()}
          lines={this.state.predictions}  
          />   
        </div>
        <Menu 
          onChange={this.handleChangeSetting}
          stateSettings={this.state.settings} />
        <Transport 
          onStart={this.handleStart} 
          onPause={this.handlePause}
          onReset={this.handleReset}
          status={this.state.status} />
        {`Iterations: ${this.state.iter} `}
      </React.Fragment>
    )
  }
}
