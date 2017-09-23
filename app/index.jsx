import React from 'react';
import ReactDOM from 'react-dom';
import Listener from 'component/listener';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = () => (
  <MuiThemeProvider>
    <Listener />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById("app")
);