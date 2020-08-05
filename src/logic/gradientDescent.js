export class Model {
  constructor(terms) {
    this.terms = terms;
  };

  f(x) {
    return this.terms.reduce((a, b) => a + b.coefficient * x ** b.exponent, 0)
  };
};

export function getTerm(coefficient, exponent) {
  return {
    coefficient: coefficient, 
    exponent: exponent
  };
};



