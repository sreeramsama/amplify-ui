import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import ReactDOM from 'react-dom/client';

import App from './App';

import '@aws-amplify/ui-react/styles.css';
import './index.css';

/** import aws_exports from './aws-exports.js'; */
// import aws_exports from '../../../../environments/auth-with-username/src/aws-exports.js';
//Amplify.configure(aws_exports);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Authenticator.Provider>
    <App />
  </Authenticator.Provider>
);
