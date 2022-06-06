import './App.css';
import React from 'react';
import { Outlet, Link } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {

  return (
    <div className='App'>
      <div className='headerDiv'>
        <h1 className='header'>Concerts that I kind of want to go to</h1>
      </div>
      <br></br>
      <div>
        <iframe title="Concert Calendar" src="https://calendar.google.com/calendar/embed?height=400&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York&mode=AGENDA&showTz=0&showCalendars=0&showTabs=0&showPrint=0&showNav=0&showDate=1&showTitle=0&src=ZWgwZWNnMnBkajY0b3JvZW01ZTVuNWxrdGdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23616161" styles="border:solid 1px #777" width="320" height="400" frameborder="0" scrolling="no"></iframe>
      </div>
      <br></br>
      <div>
        <Link hidden = "true" className='link' to="/concerts">Concerts I've been to</Link>
      </div>
    </div>
  );
}

export default App;
