import { Authenticator } from '@aws-amplify/ui-react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './app/globals.scss';
import AppProvider from './contexts/AppContext.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<Authenticator.Provider>
    <BrowserRouter>
        <AppProvider>
            <App />
            <ToastContainer autoClose={2000} />
        </AppProvider>
    </BrowserRouter>
</Authenticator.Provider>);