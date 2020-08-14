import { matrixMultiply, transpose } from './linearAlgebra';

const dataForge = require('data-forge');

export class Model {
  constructor(
    xColumn = getBlankColumn(),
    maxExponent = 1, 
    yColumn = getBlankColumn()
  ) {
    function formatX() {
      const columns = [...Array(maxExponent + 1).keys()].reduce((o, e, i) => {
        return {...o, [i]: xColumn.select(v => v ** e)}
      }, {});

      return new dataForge.DataFrame({ columns: columns })
    }

      this.xData = formatX();
      this.yData = yColumn;
      this.predictions = [];
  };

  fitLine(learningRate=0.1, maxIter=1000) {
    const numOfColumns = this.xData.getColumnNames().length;
    const m = this.xData.count();
    const transposeX = transpose(this.xData);

    let theta = new Array(numOfColumns).fill(0);
    let predictions = [this.predict(theta)]
    
    let iter = 0;

    while (iter < maxIter) {
      const prevPrediction = predictions[predictions.length - 1];

      const gradientDescent = () => {
        const regressionTerm = matrixMultiply(prevPrediction.errors, transposeX)
        return theta.map((prevTheta, i) => prevTheta - ((learningRate / m) * regressionTerm.at(i)[0]));
      };
      
      theta = gradientDescent();
      const newPrediction = this.predict(theta);
      const costDelta = (prevPrediction.cost - newPrediction.cost) / prevPrediction.cost;
      predictions.push(newPrediction);

      if (costDelta < 0.0001) {
        break;
      };
    };
    
    this.predictions = predictions;
  };

  predict(coefficients) {
    const predictedValues = matrixMultiply(this.xData, coefficients).getSeries('0');
    
    const getErrors = () => {
      let errors = [];
      predictedValues.forEach((v, i) => { errors.push( v - this.yData.at(i)) });
      return errors;
    };

    const errors = getErrors();

    const getCost = () => {
      const m = this.yData.count();
      const squaredErrors = errors.reduce((total, e) => total + (e ** 2), 0);
      return squaredErrors / (2 * m);
    };

    return {
      theta: coefficients,
      values: predictedValues,
      errors: errors,
      cost: getCost()
    };
  };
};

const getBlankColumn = () => new dataForge.Series([]);
