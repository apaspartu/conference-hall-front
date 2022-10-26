import { Alert, Button, Input, Result } from 'antd';
import React, {useState, useEffect} from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { motion, useUnmountEffect } from 'framer-motion';

import './styles/reset-password.css';
import { useScroll } from 'framer-motion';
import { resetPassword } from './api';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('typing');

    const resetToken = useParams().resetToken;
    if (resetToken === undefined) {
        return <Navigate to='/forgot-password' replace={true} />
    }

    const handlePassInput = (e: any) => {
        setPassword(e.target.value);
        setError('');
    }

    const handlePassAgInput = (e: any) => {
        setPasswordAgain(e.target.value);
        setError('');
    }

    const handleSubmit = () => {
        if (password.trim() !== passwordAgain.trim()) {
            setError('Passwords do not match')
        } else {
            resetPassword(resetToken, password)
            .then((res) => {
                if (res === true) {
                    setStatus('confirmed');
                } else {
                    setStatus('typing');
                    setError(res.message);
                }
            })
            .catch((e) => {
                setStatus('typing');
                console.log(e)
                setError('Something went wrong! Please, check your connection, refresh the page or try again later');
            })
            setStatus('sent')
        }
    }

    const isError = !!error;
    const isEmpty = password.trim().length == 0 || passwordAgain.trim().length == 0;

    if (status === 'confirmed') {
        localStorage.removeItem('accessToken')
        setTimeout(() => window.location.replace('/sign-in'), 1000)
    }

    return (
        <div className='rp-page'>
            <div className='form'>
                { status !== 'confirmed'
                ?
                <>
                <h2>Reset password</h2>
                { isError && !(status === 'confirmed') &&
                    <motion.div animate={{scale: 1.1, opacity: 1}} initial={{scale: 0, opacity: 0}} className='warning'>
                        <Alert message={error} type='warning' showIcon/>
                    </motion.div>
                }
                <label htmlFor='newp'>New password</label>
                <Input onInput={handlePassInput} value={password} type='password' placeholder='New password' id='newp'/>
                <label htmlFor='newp'>New password again</label>
                <Input onInput={handlePassAgInput} value={passwordAgain} type='password' placeholder='New password' id='newp'/>
                <Button onClick={handleSubmit} disabled={isEmpty || status === 'sent'} type='primary' className='sbutton'>Reset</Button>
                </>
                :
                <motion.div animate={{scale: 1.1}} initial={{scale: 0}}  className='reset-result'>
                    <Result
                        icon={<img src='https://www.svgrepo.com/show/286749/check.svg'/>}
                        title="Great!"
                    />
                </motion.div>
                }
            </div>
        </div>
    );
}

export default ResetPasswordPage;