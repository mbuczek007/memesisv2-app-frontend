import React from 'react';
import { Global, css } from '@emotion/react';
import Entries from './components/Entries';

const App = () => {
  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
              'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
              'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
              monospace;
          }
        `}
      />
      <div>
        <Entries />
      </div>
    </>
  );
};

export default App;
