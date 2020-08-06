const dataForge = require('data-forge');

export class Model {
  constructor(
    xColumn = getBlankColumn(),
    maxExponent = 0, 
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
  };

  predict(coefficients) {
    return;
  };
};

const getBlankColumn = () => new dataForge.Series([]);
