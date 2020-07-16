import { checkFileExtension } from './utility';

const axios = require('axios').default;

export function importFile(filename) {
  let data;

  const path = '/data/' + checkFileExtension(filename, 'csv');

  axios.get(path)
  .then(function(result) {
    data = result.data;
    console.log(data);
  })

  return data;
}