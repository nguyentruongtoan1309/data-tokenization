import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import NotFound from '@/pages/not-found';
import PrivateRoute from './PrivateRoute';

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <PrivateRoute><HomePage /></PrivateRoute> },
            { path: "/login", element: <LoginPage /> },
            { path: "*", element: <NotFound /> },
        ]
    }
];

export default routes;