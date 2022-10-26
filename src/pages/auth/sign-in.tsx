import React, {useEffect, useState} from 'react';

import 'antd/dist/antd.css';
import './styles/sign-in.css';

import {Button, Input, Divider, Alert, Result} from 'antd';
import { Link } from 'react-router-dom';
import { saveAccessToken, validateEmail } from './helpers';
import { motion } from 'framer-motion';
import { refreshSession, signIn } from './api';
import { Navigate } from 'react-router-dom';

export function SignInPage() {
    const suffix = '@fivesysdev.com'

    const [status, setStatus] = useState('typing');
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
         return <Navigate to='/schedule' replace={true}/>;
    }

    const handleEmailInput = (e: any) => {
        let value: string = e.target.value;
        if (value.endsWith(suffix)) {
            value = value.slice(0, value.indexOf(suffix));
        }
        setEmail(value);
        setError('');
    }

    const handlePasswordInput = (e: any) => {
        setPassword(e.target.value);
        setError('');
    }

    const handleSubmit = () => {
        const validated = validateEmail(email + suffix);
        if (validated) {
            setStatus('sent');
            signIn(validated, password)
            .then((res: any) => {
                console.log(res)
                if (res.accessToken) {
                    setStatus('confirmed');
                    saveAccessToken(res.accessToken);
                    return <Navigate to='/schedule' replace={true}/>;
                } else {
                    setStatus('typing')
                    if (res.message === 'Not Found') {
                        setError('Incorrect email');
                    } else {
                        setError(res.message);
                    }
                }
            })
            .catch((e) => {
                setStatus('typing');
                console.log(e)
                setError('Something went wrong! Please, check your connection, refresh the page or try again later');
            })
        } else {
            setError('Invalid email');
        }
    }

    const isEmpty = (email.trim()).length <= 3 || !password.trim();
    const isError = error !== '';

    return (
        <div className='sign-in'>
            <div className='left-panel'>
                <h1>CONFERENCE<br/>HALL</h1>
            </div>
            <div className='right-panel'>
                <img src='https://www.svgrepo.com/show/273713/computing-programming-language.svg'/>
                <h2>Sign In</h2>
                <div className='form'>
                    <label htmlFor='email-input'>Enter your email address</label>
                    <Input onInput={handleEmailInput} disabled={status === 'sent'} value={email} id='email-input' className='input' addonAfter='@fivesysdev.com' placeholder='Email address'/>
                    { isError && !(status === 'confirmed') &&
                        <motion.div animate={{scale: 1.1, opacity: 1}} initial={{scale: 0, opacity: 0}} className='warning'>
                            <Alert message={error} type='warning' showIcon/>
                        </motion.div>
                    }
                    <label htmlFor='password-input'>Enter password</label>
                    <Input onInput={handlePasswordInput} type='password' placeholder='Password' className='pinput' id='password-input'/>
                    <Button onClick={handleSubmit} disabled={isEmpty || status === 'sent'} type='primary' className='next-button'>Sign In</Button>
                    <Link to='/forgot-password' className='fp'>Forgot password</Link>
                </div>
                <Divider className='divider'>Or</Divider>
                <Button type='default' className='next-button'><Link to='/sign-up'>Sign Up</Link></Button>
            </div>
        </div>    
    );
}


export default SignInPage;