import { checkFileExtension } from './utility';

const axios = require('axios').default;

export async function importFile(filename) {
  const path = '/data/' + checkFileExtension(filename, 'csv');

  let response = await axios.get(path);
  return response.data;
}


export function parseCSV(fileString) {

}