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

  const xData = formatX();

  return {
    xData: xData,
    transposeX: transpose(xData),
    yData : yColumn,
    m: xData.count(),
    n: xData.getColumnNames().length
  };
};

export function predict(model, coefficients) {
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
