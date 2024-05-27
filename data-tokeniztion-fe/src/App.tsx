import { currentSession } from '@/lib/utils';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { useRoutes } from 'react-router-dom';
import config from '../../src/amplifyconfiguration.json';
import awsmobile from '../../src/aws-exports';
import routes from './routes';

Amplify.configure(config, {
	API: {
		REST: {
			headers: async () => {
				return {
					Authorization: (await currentSession())?.idToken?.toString(),
				} as never;
			},
		},
	},
});
Amplify.configure(awsmobile);

const App = () => {
	const elements = useRoutes(routes);
	return <div className="h-full w-full">{elements}</div>;
};

// export default withAuthenticator(App, { hideSignUp: true});
export default App;
