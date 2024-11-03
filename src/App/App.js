import './App.css';
import React from 'react';
import { Link } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ConcertGrid from '../ConcertGrid/ConcertGrid';

function App() {

  return (
    <div className='App'>
      <div className='headerDiv'>
        <h1 className='pageHeader'>Concerts that I kind of want to go to</h1>
      </div>
      <br></br>
      <div>
        <ConcertGrid></ConcertGrid>
      </div>
      <br></br>
      <div>
        <Link hidden = "true" className='link' to="/concerts">Concerts I've been to</Link>
      </div>
    </div>
  );
}

export default App;
