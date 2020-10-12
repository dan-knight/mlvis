const dataForge = require('data-forge');
const assert = require('assert');

export function matrixMultiply(leftData, rightData) {
  function prepareData() {
    let right = { 
      data: rightData,
      shape: []
    };

    const shapeErrorText = "Matrix shapes do not match.";

    function assertShapesMatch() {
      assert(right.shape.rows == left.shape.columns, shapeErrorText);
    }
    
    function prepareLeft() {
      let data;
      let shape;

      if (isDataFrame(leftData)) {
        data = leftData;
        shape = getDataFrameShape(leftData);
      } else if (isSeries(leftData) || Array.isArray(leftData)) {
        data = new dataForge.DataFrame({ 
          columns: { 
            0: leftData 
          }
        })
      } else throw "First term must be a data-forge DataFrame/Series or array."

      return { 
        data: data, 
        shape: getDataFrameShape(data)
      };
    };

    const left = prepareLeft();

    if (isDataFrame(right.data)) {
      right.shape = getDataFrameShape(right.data);
 
      if (right.shape.rows != left.shape.columns) {
        assert(right.shape.columns = left.shape.columns, shapeErrorText);
        right.data = transpose(right.data);
        right.shape = getDataFrameShape(right.data);
      };
    } else if (isSeries(right.data)) {
      right.shape = getSeriesShape(right.data);
      assertShapesMatch();

      right.data = right.data.inflate(values => ({ 0: values }));
    } else if (Array.isArray(right.data)) {
      right.shape = getArrayShape(right.data);
      assertShapesMatch();

      right.data = new dataForge.DataFrame(
        {columns: { 
          0: right.data 
        }
      });
    } else throw "Second term must be an array or a DataFrame/Series.";

    return { 
      left: left.data, 
      right: right.data 
    }
  };

  function multiply(data) {
    const leftColumns = data.left.getColumnNames();
    const rightColumns = data.right.getColumnNames().map(col => data.right.getSeries(col));
  
    function getCell(leftRow, rightCol) {
      return leftColumns.reduce((total, col, i) => {
        return total + (rightCol.at(i) * leftRow[col])
      }, 0);
    };

    function getRow(leftRow) {
      return rightColumns.reduce((o, col, i) => ({...o, [i]: getCell(leftRow, col)}), {})
    };

    let newRows = [];
    data.left.forEach(row => { 
      const r = getRow(row);
      newRows.push(r);
    });

    return new dataForge.DataFrame(newRows);
  };
  
  return multiply(prepareData());
};

export function relationshipExists(correlation, n) {
  if (n > 2) {
    const threshold = 2 / Math.sqrt(n - 1);

    return (Math.abs(correlation) >= threshold);
  } else return false;
};

export function getCorrelation(xData, yData) {
  const x = prepareSeries(xData);
  const y = prepareSeries(yData);

  const xErrors = getErrors(x);
  const xStdDev = getStandardDeviation(null, xErrors);

  const yErrors = getErrors(y);
  const yStdDev = getStandardDeviation(null, yErrors);

  return getCovariance(xErrors, yErrors) / (xStdDev * yStdDev);
};

function getCovariance(xErrors, yErrors) {
  return matrixMultiply(transpose(xErrors), yErrors).deflate().toArray()[0]['0'] / (xErrors.count() - 1);
};

function getStandardDeviation(data, errors) {
  if (!errors) {
    errors = getErrors(prepareSeries(data));
  };
  
  const sumOfSquaredError = matrixMultiply(transpose(errors), errors).deflate().toArray()[0]['0'];
  return Math.sqrt(sumOfSquaredError / (errors.count() - 1));
};

function getErrors(data, mean=null) {
  if (!mean) {
    mean = data.average();
  };

  return data.select(v => v - mean);
};

export function transpose(data) {
  let columns = {};
  prepareDataFrame(data).deflate().forEach((row, i) => columns[i] = Object.values(row)); 
  return new dataForge.DataFrame({ columns: columns });
};

function prepareDataFrame(data) {
  let d;

  if (isDataFrame(data)) {
    d = data;
  } else if (isSeries(data) || Array.isArray(data)) {
    d = new dataForge.DataFrame({ columns: { 0: data }});
  } else throw "Data must be an array or a DataFrame/Series."

  return d;
};

function prepareSeries(data) {
  let d;

  if (isSeries(data)) {
    d = data;
  } else if (Array.isArray(data)) {
    d = new dataForge.Series(data);
  } else throw new Error('Data must be a Series or an array.');

  return d;
};

function getDataFrameShape(data) {
  return {
    rows: data.count(),
    columns: data.getColumnNames().length
  };
};

function getSeriesShape(data) {
  return {
    rows: data.count(),
    columns: 1
  };
};

function getArrayShape(data) {
  return {
    rows: data.length,
    columns: 1
  };
};

function assertDataFrame(data) { 
  assert((isDataFrame(data)), 'First term must be a DataFrame.');
};


function isDataFrame(data) { return data instanceof dataForge.DataFrame; };
function isSeries(data) { return data instanceof dataForge.Series; };

