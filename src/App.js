import React, { Component } from 'react';

import Graph from './components/graph/Graph';

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
      status: 'inactive',
      iter: 0,
      maxIter: 1000,
      learningRate: 1,
      precision: 0.001,
      intervalLength: 10000
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
    this.state.iter < this.state.maxIter ? this.gradientDescent() : this.setState({ status: 'complete' });
  };

  gradientDescent() {
    const prevPrediction = this.state.predictions[this.state.predictions.length - 1];

    const getNewTheta = () => {
      const regressionTerm = matrixMultiply(prevPrediction.errors, this.state.model.transposeX);

      return prevPrediction.theta.map((prevTheta, i) => (
        prevTheta - ((this.state.learningRate / this.state.model.m) * regressionTerm.at(i)[0]))
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

      if (costDelta < this.state.precision) { this.setState({ status: 'complete' }) };
    }, this.state.intervalLength * costDelta);
  };

  handleFitLine() {
    const initialTheta = new Array(this.state.model.n).fill(0);

    this.setState({
      status: 'active',
      predictions: [predict(this.state.model, initialTheta)],
      iter: 1
    });
  };

  render() {
    return (
      <React.Fragment>
        <div style={{"maxWidth": "900px"}}>
          <Graph width="925" height="575"
          xData={this.state.model.xData.getSeries('1').toArray()}
          yData={this.state.model.yData.toArray()}
          // lines={this.state.model.predictions.map(p => {
          //   return (x) => p.reduce((total, theta, i) => {
          //     return total + (theta * x ** i)}, 0);
          // })} />
          lines={this.state.predictions}  
          />   
        </div>
        <p>
          <button onClick={() => this.handleFitLine()}>Fit Line</button>
          {`Iterations: ${this.state.iter} `}
        </p>
      </React.Fragment>
    )
  }
}
