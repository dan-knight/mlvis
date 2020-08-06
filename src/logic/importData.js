import { checkFileExtension } from './utility';

const axios = require('axios').default;

const dataForge = require('data-forge');

export async function importFile(filename, type) {
  const path = '/data/' + checkFileExtension(filename, type);

  let response = await axios.get(path);
  return response.data;
}

export async function importCSV(filename) {
  let CSVstring = await importFile(filename, 'csv');
  return dataForge.fromCSV(CSVstring);
};

export const getBlankData = () => new dataForge.DataFrame({ values: []})