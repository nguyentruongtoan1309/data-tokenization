import { Authenticator } from '@aws-amplify/ui-react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import AppProvider from './contexts/AppContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './app/globals.scss';
import './index.scss';

export const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
	<BrowserRouter>
		<Authenticator.Provider>
			<AppProvider>
				<QueryClientProvider client={queryClient}>
					<App />
					<ToastContainer autoClose={2000} />
				</QueryClientProvider>
			</AppProvider>
		</Authenticator.Provider>
	</BrowserRouter>,
);
