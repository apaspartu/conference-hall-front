import React from 'react';
import './App.css';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SignInPage from './pages/auth/sign-in';
import SignUpPage, {EmailVerificationForm, ProfileCreationForm} from './pages/auth/sign-up';
import HomePage from './pages/home/home';
import ResetPasswordPage from './pages/auth/reset-password';
import ForgotPasswordPage from './pages/auth/forgot-password';
import ProfilePage from './pages/profile/profile';
import { profileLoader } from './pages/auth/api';

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
                path: '',
                element: <EmailVerificationForm />
            },
            {
                path: ':inviteToken',
                element: <ProfileCreationForm />
            }
        ]
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />
    },
    {
        path: '/reset-password/:resetToken',
        element: <ResetPasswordPage />
    },
    {
        path: '/schedule',
        element: <h1 style={{width: '100%', textAlign: 'center'}}>Schedule</h1>
    },
    {
        path: 'profile',
        element: <ProfilePage />,
        loader: profileLoader,
    },
]);

function App() {
    return (
        <RouterProvider router={router}/>
    );
}

export default App;
