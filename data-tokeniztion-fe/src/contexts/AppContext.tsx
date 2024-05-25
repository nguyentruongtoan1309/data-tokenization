import { AuthStatus, AuthType } from '@/constants';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { createContext, useContext, useMemo } from 'react';

interface AppContextProps {
    user: object,
    isLoggedIn: boolean;
}
export const AppContext = createContext<AppContextProps | null>(null);

interface AppUpdaterContextProps {
    setIsLoggedIn: (val: boolean) => void;
}
export const AppUpdaterContext = createContext<AppUpdaterContextProps | null>(null);

const AppProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const { authStatus } = useAuthenticator(context => [context.authStatus]);

    const isLoggedIn = useMemo(() => {
        if (authStatus === AuthType.AUTHENTICATED) {
            return true;
        }

        return false;
    }, [authStatus]);

    const state = useMemo(() => {
        return {
            user,
            isLoggedIn,
        };
    }, [user, isLoggedIn]);

    const dispatchFn = useMemo(() => {
        return null;
    }, []);

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

    // const setIsLoggedIn = useCallback(
    //     (val: boolean) => {
    //         if (dispatchFn) {
    //             dispatchFn.setIsLoggedIn(val);

    //         }
    //     },
    //     [dispatchFn],
    // );


    return {};
}

export { useAppContext, useAppUpdater };
export default AppProvider;