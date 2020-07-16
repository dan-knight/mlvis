import React, { useState } from 'react';

import { importFile } from './logic/importData';

export default function App() {
  const [data, setData] = useState({})
  
  return (
    <React.Fragment>
      <h1>Hello world</h1>
      <p>{JSON.stringify(data)}</p>
      <button onClick={async () => setData(await importFile('iris'))}>Import</button>
    </React.Fragment>
  )
}
