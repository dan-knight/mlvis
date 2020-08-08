import React, { Component } from 'react';

import Graph from './components/graph/Graph';

import { importCSV, getBlankData } from './logic/importData';
import { Model } from './logic/gradientDescent';

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      data: getBlankData(),
      model: new Model()
    }
  }

  async importData(filename) {
    this.setState({ data: await importCSV(filename) });
  }

  async componentDidMount() {
    const data = await importCSV('iris');
    
    this.setState({
      data: data,
      model: new Model(
        data.getSeries('sepal_width'), 3,
        data.getSeries('sepal_length'))
    });
  }

  render() {
    // console.log(this.state.model.xData.getSeries('1').toArray())

    return (
      <React.Fragment>
        <div style={{"maxWidth": "900px"}}>
          <Graph width="925" height="575" 
            xData={this.state.model.xData.getSeries('1').toArray()} 
            yData={this.state.model.yData.toArray()} 
            lines={[
              x => 2 * x,
              x => x ** 2]} />
            
        </div>
      </React.Fragment>
    )
  }
}
