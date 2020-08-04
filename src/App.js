import React, { Component } from 'react';

import Graph from './components/graph/Graph';

import { importCSV } from './logic/importData';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      data: []
    }
  }

  async importData(filename) {
    const newData = await importCSV(filename);
    this.setState({
      data: newData
    })
  }

  async componentDidMount() {
    this.importData('iris');
  }
  
  render() {
    return (
      <div style={{"maxWidth": "900px"}}>
        <Graph width="925" height="575" 
          data={this.state.data} lines={[x => x ** 1.2, x => 1.5 * x ** 1.1]}/>
      </div>
    )
  }
}
