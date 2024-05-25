import '@aws-amplify/ui-react/styles.css';
import { useRoutes } from 'react-router-dom';
import routes from './routes';

const App = () => {
	const elements = useRoutes(routes);
	const handleSuccess = () => {
		alert('password is successfully changed!');
	};
	return <div className="h-full w-full">{elements}</div>;
};

// export default withAuthenticator(App, { hideSignUp: true});
export default App;
