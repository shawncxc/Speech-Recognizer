import React from 'react';
import ReactDOM from 'react-dom';
import Listener from 'component/listener';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import store from 'store/store';

// UI
import 'style/body.css';

const App = () => (
  <Provider store={ store }>
    <MuiThemeProvider>
      <Listener />
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(
  <App />,
  document.getElementById("app")
);