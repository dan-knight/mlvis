function relationshipExists(xValues, yValues) {
  const correlation = getCorrelation(xValues, yValues);
  const threshold = 2 / Math.sqrt(xValues.length);

  return (Math.abs(correlation) >= threshold);
};

function getCorrelation(xValues, yValues) {
  const xErrors = getErrors(xValues);
  const xStdDev = getStdDev(xErrors);

  const yErrors = getErrors(yValues);
  const yStdDev = getStdDev(yErrors);
  return getCovariance(xErrors, yErrors) / (xStdDev * yStdDev);
};

function getCovariance(xErrors, yErrors) {
  const totalVariance = xErrors.reduce((total, current, i) => (
    total + (current * yErrors[i])
  ), 0);

  return totalVariance / (xValues.length - 1);
};

function getStdDev(errors) {
  const sumOfSquares = errors.reduce((total, current) => total + (current ** 2), 0);
  return Math.sqrt(sumOfSquares / (errors.length - 1));
};

function getErrors(values, mean=null) {
  if (!mean) {
    mean = getMean(values);
  };

  return values.map(v => v - mean);
};

function getMean(values) {
  return getSum(values) / values.length;
};

function getSum(values) {
  return values.reduce((total, current) => total + current, 0);
};