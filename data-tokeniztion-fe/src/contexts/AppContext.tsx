import { AuthType } from '@/constants';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Hub } from 'aws-amplify/utils';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light';

type User = {
	username: string;
	userId: string;
};

interface AppContextProps {
	user: User | null;
	isLoggedIn: boolean;
	defaultTheme?: Theme;
}
export const AppContext = createContext<AppContextProps | null>(null);

interface AppUpdaterContextProps {
	setIsLoggedIn?: (val: boolean) => void;
	setTheme: (theme: Theme) => void;
}
export const AppUpdaterContext = createContext<AppUpdaterContextProps | null>(null);

type AppProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
};

const AppProvider: React.FC<AppProviderProps> = ({ children, defaultTheme = 'light' }) => {
	const { user } = useAuthenticator((context) => [context.user]);
	const { authStatus } = useAuthenticator((context) => [context.authStatus]);
	const [userDetail, setUserDetail] = useState<User | null>(null);
	const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || defaultTheme);
	
	useEffect(() => {
		if (user) {
			setUserDetail(user);
		}
	}, [user]);

	useEffect(() => {
		Hub.listen('auth', (res: any) => {
			if (res.event === 'signedIn') {
				const { username, userId } = res.payload.data;
				setUserDetail({
					username,
					userId,
				});
			}
			if (res.event === 'signedOut') {
				setUserDetail(null);
			}
		});
	}, []);

	// Set theme
	useEffect(() => {
		if (theme === 'dark') {
			document.body.setAttribute('class', 'dark');
			return;
		} else {
			document.body.setAttribute('class', 'light');
		}
	}, [theme]);
	
	const isLoggedIn = useMemo(() => {
		if (authStatus === AuthType.AUTHENTICATED) {
			return true;
		}

		return false;
	}, [authStatus]);

	const state = useMemo(() => {
		return {
			user: userDetail,
			isLoggedIn,
			defaultTheme: theme
		};
	}, [userDetail, isLoggedIn, theme]);

	const dispatchFn = useMemo(() => {
		return {
			setTheme
		};
	}, [setTheme]);

	return (
		<AppContext.Provider value={state}>
			<AppUpdaterContext.Provider value={dispatchFn}>{children}</AppUpdaterContext.Provider>
		</AppContext.Provider>
	);
};

function useAppContext() {
	const state = useContext(AppContext);
	if (typeof state === 'undefined') {
		throw new Error('useAppContext must be used within a AppProvider');
	}

	if (!state) {
		return { user: null, isLoggedIn: false };
	}

	return state;
}

function useAppUpdater() {
	const dispatchFn = useContext(AppUpdaterContext);

	if (typeof dispatchFn === 'undefined') {
		throw new Error('useAppUpdater must be used within a AppProvider');
	}

	const setTheme = useCallback(
		(theme: Theme) => {
			if (dispatchFn) {
				dispatchFn.setTheme(theme);
				localStorage.setItem('theme', theme);
			}
		},
		[dispatchFn],
	);

	return { setTheme };
}

export { useAppContext, useAppUpdater };
export default AppProvider;
