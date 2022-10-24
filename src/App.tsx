import React from 'react';
import './App.css';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SignInPage from './pages/auth/sign-in';
import SignUpPage, {ProfileCreationForm} from './pages/auth/sign-up';
import HomePage from './pages/home/home';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/sign-in',
        element: <SignInPage />
    },
    {
        path: '/sign-up',
        element: <SignUpPage />,
        children: [
            {
                path: ':inviteToken',
                element: <ProfileCreationForm />
            }
        ]
    },
    {
        path: '/schedule',
        element: <h1 style={{width: '100%', textAlign: 'center'}}>Schedule</h1>
    }
]);

function App() {
    return (
        <RouterProvider router={router}/>
    );
}

export default App;
