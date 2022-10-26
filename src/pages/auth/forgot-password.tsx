import { Alert, Button, Input, Result } from 'antd';
import React, {useState} from 'react';
import { validateEmail } from './helpers';
import { motion } from 'framer-motion';

import './styles/forgot-password.css';
import { forgotPassword } from './api';

function ForgotPasswordPage() {
    const suffix = '@fivesysdev.com';
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('typing');
    
    const handleInput = (e: any) => {
        let value: string = e.target.value;
        if (value.endsWith(suffix)) {
            value = value.slice(0, value.indexOf(suffix));
        }
        setEmail(value);
        setError('');
    }

    const handleSubmit = () => {
        const validated = validateEmail(email + suffix);
        if (!validated) {
            setError('Invalid email')
            return;
        }
        forgotPassword(validated)
        .then((res) => {
            console.log(res)
            if (res === true) {
                setStatus('confirmed');
            } else {
                setStatus('typing');
                if (res.message === 'Not Found') {
                    setError('Incorrect password')
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

        setStatus('sent');
    }

    const isError = error !== '';
    const isEmpty = email.trim().length === 0;

    return (
        <div className='fp-page'>
            <div className='form'>
                { status !== 'confirmed'
                ?
                <>
                <h2>Enter email for your account</h2>
                { isError && !(status === 'confirmed') &&
                    <motion.div animate={{scale: 1.1, opacity: 1}} initial={{scale: 0, opacity: 0}} className='warning'>
                        <Alert message={error} type='warning' showIcon/>
                    </motion.div>
                }
                <label htmlFor='email-input'>We will send you a link for password reset</label>
                <Input onInput={handleInput} value={email} disabled={status==='sent'} placeholder='Email address' id='email-input' addonAfter='@fivesysdev.com'/>
                <Button onClick={handleSubmit} disabled={isEmpty || status === 'sent'} type='primary' className='sbutton'>Continue</Button>
                </>
                :
                <motion.div animate={{scale: 1.1}} initial={{scale: 0}}  className='forgot-result'>
                    <Result
                        icon={<img src='https://www.svgrepo.com/show/286749/check.svg'/>}
                        title="We have sent you an reset password link"
                    />
                </motion.div>
                }
            </div>
        </div>
    );
}

export default ForgotPasswordPage;