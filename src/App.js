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

  async componentDidMount() {
    const newData = await importCSV('iris');
    this.setState({
      data: newData
    })
  }
  
  render() {
    return (
      <div style={{"max-width": "900px"}}>
        <Graph data={this.state.data} />
      </div>
    )
  }
}
