import React, { Component } from 'react';

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
      <React.Fragment>
        <h1>Hello world</h1>
        <p>{JSON.stringify(this.state.data)}</p>
      </React.Fragment>
    )
  }
}
