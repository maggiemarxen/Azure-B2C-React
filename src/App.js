import React from 'react';
import { AccountCircle } from '@material-ui/icons';
import { Button, Box } from '@material-ui/core';
import './App.css';
import useAuthProvider from './useAuthProvider'

const App = () => {
  const { loginTypes, account, loginAsync, logoutAsync } = useAuthProvider();
  
  return (
    <div className="App">
      <header className="App-header">
          {account? (   
        <div>
          {/*<p>account: {JSON.stringify(account)}</p>*/} 
          <p>Hello, {account.idToken.given_name}!</p>
          <Button variant="contained" color="primary" startIcon={<AccountCircle />} onClick={() => {logoutAsync(loginTypes.redirect);}}>logout</Button>
          <Box m={2} />
        </div>
      ) : (
        <Button variant="contained" color="primary" startIcon={<AccountCircle />} onClick={() => {loginAsync(loginTypes.redirect);}}>login</Button>          
      )}
      </header>
    </div>
  );
}

export default App;
