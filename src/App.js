import React from 'react';
import logo from './logo.svg';
import { AccountCircle } from '@material-ui/icons';
import { Button, Box } from '@material-ui/core';
import './App.css';
import authProvider from './auth'

const App = () => {
  const { loginTypes, account, loginAsync, logoutAsync } = authProvider();
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.

          {account? (   
        <div>
          <p>account: {JSON.stringify(account)}</p>
          <Button variant="contained" color="primary" startIcon={<AccountCircle />} onClick={() => {logoutAsync(loginTypes.redirect);}}>logout</Button>
          <Box m={2} />
        </div>
      ) : (
        <Button variant="contained" color="primary" startIcon={<AccountCircle />} onClick={() => {loginAsync(loginTypes.redirect);}}>login</Button>          
      )}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
