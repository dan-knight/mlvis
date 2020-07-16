export function checkFileExtension(filename, type) {
  const extension = type.startsWith('.') ? type  : '.' + type;
  return filename.endsWith(extension) ? filename : filename + extension; 
}