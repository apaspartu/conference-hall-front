import React, {useState} from 'react';
import { useOutlet, useParams } from 'react-router-dom';

import 'antd/dist/antd.css';
import './styles/verify-email.css';
import './styles/create-profile.css';

import {Button, Input, Divider, Alert, Result} from 'antd';
import { Link } from 'react-router-dom';
import { saveAccessToken, validateEmail } from './helpers';
import { createProfile, verifyEmail } from './api';
import { motion } from 'framer-motion';


export function EmailVerificationForm() {
    const suffix = '@fivesysdev.com'

    const [status, setStatus] = useState('typing');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    const handleInput = (e: any) => {
        setEmail(e.target.value);
        setError('');
    }

    const handleSubmit = () => {
        const validated = validateEmail(email + suffix);
        if (validated) {
            setStatus('sent');
            verifyEmail(validated)
            .then((res) => {
                console.log(res)
                if (res === true) {
                    setStatus('confirmed');
                } else {
                    setStatus('typing')
                    setError(res.message);
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

    const isEmpty = (email.trim()).length <= 3;
    const isError = error !== '';
    const isConfirmed = status === 'confirmed';

    return (
        <div className='verify-back'>
            <div className='left-panel'>
                <h1>CONFERENCE<br/>HALL</h1>
            </div>
            <div className='right-panel'>
                <img src='https://www.svgrepo.com/show/273713/computing-programming-language.svg'/>
                <h2>Sign Up</h2>
                <div className='email-validation-frame'>
                    { !isConfirmed ?
                        <>
                        <label htmlFor='email-input'>Enter your email address</label>
                        <Input onInput={handleInput} disabled={status === 'sent'} value={email} id='email-input' className='input' addonAfter='@fivesysdev.com' placeholder='Email address'/>
                        { isError && !(status === 'confirmed') &&
                            <motion.div animate={{scale: 1.1, opacity: 1}} initial={{scale: 0, opacity: 0}} className='warning'>
                                <Alert message={error} type='warning' showIcon/>
                            </motion.div>
                        }
                        <Button onClick={handleSubmit} disabled={isEmpty || status === 'sent'} type='primary' className='next-button'>Continue</Button>
                        </>
                        :
                        <motion.div animate={{scale: 1.1}} initial={{scale: 0}}>
                            <Result
                                icon={<img src='https://www.svgrepo.com/show/286749/check.svg'/>}
                                title="We have sent you a confirmation email" className='verify-result'
                            />
                        </motion.div>
                    }
                </div>
                <Divider className='divider'>Or</Divider>
                <Button type='default' className='next-button'><Link to='/sign-in'>Sign In</Link></Button>
            </div>
        </div>    
    );
}

export function ProfileCreationForm() {
    const inviteToken = useParams().inviteToken;

    if (inviteToken === undefined) {
        throw Error('Empty invite token');
    }

    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');

    const [error, setError] = useState('');
    const [status, setStatus] = useState('typing');

    const handleFNInput = (e: any) => {
        setFullname(e.target.value);
        setError('');
    }
    const handlePassInput = (e: any) => {
        setPassword(e.target.value);
        setError('');
    } 
    const handlePassAgInput = (e: any) => {
        setAgainPassword(e.target.value);
        setError('');
    } 

    const handleSubmit = () => {
        if (password.trim() !== againPassword.trim()) {
            setError('Passwords do not match');
        } else {
            createProfile(fullname, password.trim(), inviteToken)
            .then((res) => {
                if (res.accessToken) {
                    setStatus('confirmed');
                    saveAccessToken(res.accesToken);
                    setTimeout(() => {
                        window.location.replace("http://localhost:3000/schedule");
                    }, 1500);
                } else {
                    setStatus('typing')
                    setError(res.message);
                }
            })
            .catch((e) => {
                setStatus('typing');
                console.log(e)
                setError('Something went wrong! Please, check your connection, refresh the page or try again later');
            })
            setStatus('sent');
        }
    }

    const isAllFilled = fullname.trim().length > 0 && password.trim().length > 0 && againPassword.trim().length > 0;
    const isConfirmed = status === 'confirmed';

    return (
        <div className='create-back'>
            <div className='creation-form'>
                { !isConfirmed ?
                <>
                <h2>Complete creation of your profile</h2>
                { error !== '' &&
                    <motion.div animate={{scale: 1.1, opacity: 1}} initial={{scale: 0, opacity: 0}} className='warning'>
                        <Alert message={error} type='warning' showIcon/>
                    </motion.div>
                }
                <label htmlFor='name-input'>Enter your full name</label>
                <Input onInput={handleFNInput} value={fullname} type='text' id='name-input' placeholder='Full name' className='cinput' required />
                <label htmlFor='password-input'>Password</label>
                <Input onInput={handlePassInput}  value={password} type='password' id='password-input' placeholder='Password' className='cinput' required />
                <label htmlFor='email-input'>Confirm password</label>
                <Input onInput={handlePassAgInput}  value={againPassword} type='password' id='passworda-input' placeholder='Password again' className='cinput' required />
                <Button onClick={handleSubmit} disabled={!isAllFilled || status==='sent'} type='primary' className='next-button'>Complete</Button>
           
                </>
                :
                <motion.div animate={{scale: 1.1}} initial={{scale: 0}}>
                    <Result
                        icon={<img src='https://www.svgrepo.com/show/286749/check.svg'/>}
                        title="Welcome!" className='create-result'
                    />
                </motion.div>
                }
            </div>
        </div>
    );
}

function SignUpPage() {
    // after email verification
    const profileCreationForm = useOutlet();

    return (
        <>
        { profileCreationForm
        ? 
            profileCreationForm
        :
            <EmailVerificationForm />
        }
        </>
    );
}

export default SignUpPage;