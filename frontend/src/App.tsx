import React, { useEffect } from 'react';

import axios from './axios';

function App() {

  useEffect(() => {
    axios.get('/listings')
         .then(res => {
           console.log(res.data);
         })
  })
  return (
    <div className="App">
      Hello React
    </div>
  );
}

export default App;
