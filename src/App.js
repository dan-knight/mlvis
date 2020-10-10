import React, { Component } from 'react';

import Graph from './components/graph/Graph';
import Transport from './components/menu/Transport';
import ConfigMenu from './components/menu/ConfigMenu';
import FeatureSelect from './components/menu/FeatureSelect';
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
      xFeature: '',
      yFeature: '',
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
    this.setState(() => ({ data: data }));

    this.changeFeatures('Sepal Length', 'Sepal Width', data);
  };

  componentDidUpdate() {
    if (this.state.status == 'active') {
      this.fitLine()
    };
  };

  changeFeatures(xName, yName, data=this.state.data) {
    const model = getNewModel(
      data.getSeries(xName), 1,
      data.getSeries(yName));

    this.setState({
      xFeature: xName,
      yFeature: yName,
      model: model,
      predictions: []
    });
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
    this.setState(() => ({ 
      status: 'clean',
      iter: 0,
      prevCost: 0,
      predictions: []
    }));
  };

  handleFeatureChange = (newFeature, name) => { 
    this.setState(() => ({ [name]: newFeature }));

    const config = name === 'xFeature' ? [newFeature, this.state.yFeature] : [this.state.xFeature, newFeature];
    this.changeFeatures(...config);
  };

  handleChangeSetting = (setting, value) => {
    this.setState({settings: {
      ...this.state.settings,
      [setting]: value
    }});
  };

  render() {
    console.log(this.state.data.getColumnNames())
    return (
      <div class="container">
        <Row>
          <Col size="3">
            <FeatureSelect name={'xFeature'} label={'x Feature'}
              options={this.state.data.getColumnNames().filter(c => c !== this.state.yFeature)} 
              status={this.state.status} value={this.state.xFeature} 
              onChange={this.handleFeatureChange}/>
            <FeatureSelect name={'yFeature'} label={'y Feature'}
              options={this.state.data.getColumnNames().filter(c => c !== this.state.xFeature)} 
              status={this.state.status} value={this.state.yFeature} 
              onChange={this.handleFeatureChange}/>
          </Col>
          <Col size="9">
            <Graph width="925" height="575"
              xData={this.state.model.xData.getSeries('1').toArray()} xName={this.state.xFeature}
              yData={this.state.model.yData.toArray()} yName={this.state.yFeature}
              lines={this.state.predictions}  
              />   
          </Col>
        </Row>
        <Row>
          <Col size="6">
            <ConfigMenu 
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
