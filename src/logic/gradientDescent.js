import { matrixMultiply, transpose } from './linearAlgebra';

const dataForge = require('data-forge');

export function getNewModel(
  xColumn = getBlankColumn(),
  maxExponent = 1, 
  yColumn = getBlankColumn()
) {
  function formatX() {
    const columns = [...Array(maxExponent + 1).keys()].reduce((o, e, i) => {
      return {...o, [i]: xColumn.select(v => v ** e)}
    }, {});

    return new dataForge.DataFrame({ columns: columns })
  };

  return {
    xData : formatX(),
    yData : yColumn,
    predictions : []
  };
};

export function fitLine(model, learningRate=0.01, maxIter=1000) {
  const numOfColumns = model.xData.getColumnNames().length;
  const m = model.xData.count();
  const transposeX = transpose(model.xData);

  let theta = new Array(numOfColumns).fill(0);
  let predictions = [predict(model, theta)]
  
  let iter = 1;

  while (iter < maxIter) {
    const prevPrediction = predictions[predictions.length - 1];

    const gradientDescent = () => {
      const regressionTerm = matrixMultiply(prevPrediction.errors, transposeX)
      return theta.map((prevTheta, i) => prevTheta - ((learningRate / m) * regressionTerm.at(i)[0]));
    };
    
    theta = gradientDescent();
    const newPrediction = predict(model, theta);
    const costDelta = (prevPrediction.cost - newPrediction.cost) / prevPrediction.cost;
    predictions.push(newPrediction);

    if (costDelta < 0.0001) {
      break;
    } else iter ++;
  };
  
  model.predictions = predictions;
};

function predict(model, coefficients) {
  const predictedValues = matrixMultiply(model.xData, coefficients).getSeries('0');
  
  const getErrors = () => {
    let errors = [];
    predictedValues.forEach((v, i) => { errors.push( v - model.yData.at(i)) });
    return errors;
  };

  const errors = getErrors();

  const getCost = () => {
    const m = model.yData.count();
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

const getBlankColumn = () => new dataForge.Series([]);
