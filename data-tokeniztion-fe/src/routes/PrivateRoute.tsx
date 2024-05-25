import { useAppContext } from '@/contexts/AppContext';
import React from 'react';
import { Navigate } from 'react-router';

const PrivateRoute: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const { isLoggedIn } = useAppContext();

    if (isLoggedIn) {
        return children;
    }

    // {authStatus === 'configuring' && 'Loading...'}
    // {authStatus !== 'authenticated' ? <Authenticator /> : <Home />}

    return <Navigate to='/login' />;

};

export default PrivateRoute;