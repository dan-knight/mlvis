export function checkFileExtension(filename, type) {
  const extension = type.startsWith('.') ? type  : '.' + type;
  return filename.endsWith(extension) ? filename : filename + extension; 
};

export function getMax(array) {
  return array.reduce((max, nextValue) => (max < nextValue ? nextValue : max), 0);
};

export function getEqualDivisions(range, amount) {
  const sectionSize = (range[1] - range[0]) / amount;

  return Array.from([...Array(amount + 1).keys()], i => range[0] + i * sectionSize);
}