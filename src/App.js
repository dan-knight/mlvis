import React, { Component } from 'react';

import Graph from './components/graph/Graph';

import { importCSV } from './logic/importData';
import { Model, getTerm } from './logic/gradientDescent';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      data: [],
      models: [new Model([getTerm(1, 2), getTerm(1, 1)])]
    }
  }

  async importData(filename) {
    const newData = await importCSV(filename);
    this.setState({
      data: newData,
    })
  }

  async componentDidMount() {
    this.importData('iris');
    this.addModel(new Model([getTerm(2, 1), getTerm(2, 0)]));
  }

  addModel(model) {
    this.setState({
      models: [...this.state.models, model]
    });
  };

  fitModel() {
    
  };
  
  render() {
    return (
      <React.Fragment>
        <div style={{"maxWidth": "900px"}}>
          <Graph width="925" height="575" 
            data={this.state.data} lines={this.state.models}/>
        </div>
        <button onClick={this.fitModel}>Fit Model</button>
      </React.Fragment>
    )
  }
}
