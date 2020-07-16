import { checkFileExtension } from './utility';

const axios = require('axios').default;
const d3 = require('d3');

export async function importFile(filename, type) {
  const path = '/data/' + checkFileExtension(filename, type);

  let response = await axios.get(path);
  return response.data;
}

export async function importCSV(filename) {
  let CSVstring = await importFile(filename, 'csv');
  return d3.csvParse(CSVstring);
}