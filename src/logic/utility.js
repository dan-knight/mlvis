export function checkFileExtension(filename, type) {
  const extension = type.startsWith('.') ? type  : '.' + type;
  return filename.endsWith(extension) ? filename : filename + extension; 
};

export function getMaxAttribute(data, attribute) {
  const maxObject = data.reduce((previous, next) => previous[attribute] > next[attribute] ? previous : next, 0)
  return (maxObject !== {} ? maxObject[attribute] : maxObject)
};

export function getEqualDivisions(range, amount) {
  const sectionSize = (range[1] - range[0]) / amount;

  return Array.from([...Array(amount + 1).keys()], i => range[0] + i * sectionSize);
}