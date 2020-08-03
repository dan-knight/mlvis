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
      <div style={{"maxWidth": "900px"}}>
        <Graph data={this.state.data} width="900" height="550" />
      </div>
    )
  }
}
