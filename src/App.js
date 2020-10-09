import React, { Component } from 'react';

import Graph from './components/graph/Graph';
import Transport from './components/menu/Transport';
import Menu from './components/menu/Menu';
import { Row, Col, Line } from './components/layout';

import { timeout } from './logic/utility';
import { importCSV, getBlankData } from './logic/importData';
import { getNewModel, predict } from './logic/gradientDescent';
import { matrixMultiply } from './logic/linearAlgebra';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      testVal: 0,
      data: getBlankData(),
      model: getNewModel(),
      predictions: [],
      status: 'clean',
      iter: 0,
      prevCost: 0,
      settings: {
        maxIter: '1000',
        learningRate: '1',
        precision: '0.001',
        intervalLength: '1000'
      }
    };
  };

  async importData(filename) {
    this.setState({ data: await importCSV(filename) });
  };

  async componentDidMount() {
    const data = await importCSV('iris');
    
    const xName = 'Sepal Width';
    const yName = 'Sepal Length';

    const model = getNewModel(
      xName,
      yName,
      data.getSeries(xName), 1,
      data.getSeries(yName));

    this.setState({
      data: data,
      model: model,
      predictions: []
    });
  };

  componentDidUpdate() {
    if (this.state.status == 'active') {
      this.fitLine()
    };
  };

  fitLine = async () =>  {
    if (this.state.iter < this.state.settings.maxIter) {
      Promise.all([
        new Promise(resolve => { resolve(this.gradientDescent()) }),
        timeout(this.state.prevCost * this.state.settings.intervalLength)
      ]).then(values => {
        if (this.state.status === 'active') {
          const newState = values[0];
          this.setState(newState);
        };
      });
    } else this.setState({ status: 'complete' });
  };

  async gradientDescent() {
    const prevPrediction = this.state.predictions[this.state.predictions.length - 1];

    const getNewTheta = () => {
      const regressionTerm = matrixMultiply(prevPrediction.errors, this.state.model.transposeX);

      return prevPrediction.theta.map((prevTheta, i) => (
        prevTheta - ((this.state.settings.learningRate / this.state.model.m) * regressionTerm.at(i)[0]))
      );
    };

    const newPrediction = predict(this.state.model, getNewTheta())
    
    const costDelta = (prevPrediction.cost - newPrediction.cost) / prevPrediction.cost;

    let newState = {
      predictions: [...this.state.predictions, newPrediction],
      iter: this.state.iter + 1,
      prevCost: costDelta
    };
      
    if (costDelta < this.state.settings.precision) { 
      newState.status = 'complete';
    };

    return newState;
  };

  handleStart = () => {
    if (this.state.status === 'clean') {
      const initialTheta = new Array(this.state.model.n).fill(0);

      this.setState({
        predictions: [predict(this.state.model, initialTheta)],
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
    this.setState(prevState => ({ 
      status: 'clean',
      iter: 0,
      prevCost: 0,
      predictions: []
    }));
  };

  handleChangeSetting = (setting, value) => {
    this.setState({settings: {
      ...this.state.settings,
      [setting]: value
    }});

    console.log(setting, value)
  };

  render() {
    return (
      <div class="container">
        <Row>
          <Col size="12">
            <Graph width="925" height="575"
            xData={this.state.model.xData.getSeries('1').toArray()} xName={this.state.model.xName}
            yData={this.state.model.yData.toArray()} yName={this.state.model.yName}
            lines={this.state.predictions}  
            />   
          </Col>
        </Row>
        <Row>
          <Col size="6">
            <Menu 
              onChange={this.handleChangeSetting}
              stateSettings={this.state.settings}
              status={this.state.status} />
          </Col>
          <Col size="6">
            <Line>
              <Transport 
                onStart={this.handleStart} 
                onPause={this.handlePause}
                onReset={this.handleReset}
                status={this.state.status} />
            </Line>
            {`Iterations: ${this.state.iter} `}
          </Col>
        </Row>
      </div>
    );
  };
};
