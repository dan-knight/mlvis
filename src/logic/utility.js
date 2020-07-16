export function checkFileExtension(filename, type) {
  const suffix = type.startsWith('.') ? type : '.' + type;
  return filename.endsWith(suffix) ? filename : filename + suffix; 
}