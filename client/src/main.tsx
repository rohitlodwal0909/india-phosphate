import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/css/globals.css';
import App from './App';
import React from 'react';
import Spinner from './views/spinner/Spinner';
import { CustomizerContextProvider } from './context/CustomizerContext';
import { DashboardContextProvider } from './context/DashboardContext/DashboardContext';
import './utils/i18n';

import { Provider } from "react-redux";
import {store} from './store';
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
     <React.StrictMode>
      <Provider store={store}>
      <DashboardContextProvider>
        <CustomizerContextProvider>
          <Suspense fallback={<Spinner />}>
          
            <App />
        
          </Suspense>
        </CustomizerContextProvider>
      </DashboardContextProvider>
    </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
