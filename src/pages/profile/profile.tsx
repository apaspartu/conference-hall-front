import { Alert, Button, Input } from 'antd';
import React, {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import { useLoaderData, useNavigate } from 'react-router-dom';
import './profile.css';
import { ProfileInfo, updateProfile, changePassword, loadProfile } from '../auth/api';
import { Link } from 'react-router-dom';
import TextLoading from '../../components/text-loading/text-loading';


function ProfilePage() {
    const [profile, setProfile] = useState({});

    useEffect(() => {
        loadProfile()
        .then((data) => {
            setProfile({name: data.name, email: data.email});
            setName(data.name);
        })
    }, [])

    const [status, setStatus] = useState('typing');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleNameInput = (e: any) => {
        setName(e.target.value)
        setError('');
    }

    const handleOldPassInput = (e: any) => {
        setOldPassword(e.target.value);
        setError('');
    }

    const handleNewPassInput = (e: any) => {
        setNewPassword(e.target.value);
        setError('');
    }

    const changeName = () => {
        updateProfile(name)
        .then((res) => {
            if (res === true) {
                navigate(0);
            }
        })
        .catch((e) => {
            if (e.response.status === 403) {
                navigate('/sign-in')
            } else {
                setError(e.message);
            }
        })
        setStatus('sent')
    }

    const submitPassword = () => {
        changePassword(oldPassword, newPassword)
        .then((res) => {
            if (res === true) {
                navigate(0);
            }
        })
        .catch((e) => {
            setStatus('typing')
            setError(e.response.data.message);
        })
        setStatus('sent')
    }

    const wasNameChanged = name !== profile.name;
    const isNameValid = name.trim().length > 1;
    const isPasswordsValid = oldPassword.trim().length >= 2 && newPassword.trim().length >= 2;

    const isError = !!error;

    return (
        <div className='p-page'>
            <Link to='/schedule'><Button type='default' className='go-schedule' icon={<img src='https://www.svgrepo.com/show/378694/schedule.svg'/>}>Schedule</Button></Link>
            <div className='view'>
                <h1>Your profile</h1>
                
                {isError &&
                <motion.div animate={{scale: 1}} initial={{scale: 0}}>
                    <Alert message={error} type='warning' showIcon className='error-message'/>
                </motion.div>}

                <div className='change-name propframe'>
                    <div>
                        <label htmlFor='name'>Name:</label>
                        <Input onInput={handleNameInput}  id="name" className='input' value={name} />
                    </div>
                    <Button onClick={changeName} disabled={!wasNameChanged || !isNameValid || status==='sent'} className='sbutton' type='primary'>Change name</Button>
                </div>
                <div className='show-email propframe'>
                    <label htmlFor='email'>Email:</label>
                    <h4 id='email'>{profile.email ? profile.email : <TextLoading />}</h4>
                </div>
                <div className='change-password propframe'>
                    <label>Change password:</label>
                    <Input onInput={handleOldPassInput} value={oldPassword} type='password' placeholder='Old password' className='input'/>
                    <Input onInput={handleNewPassInput} value={newPassword} type='password' placeholder='New password' className='input'/>
                    <Button onClick={submitPassword} disabled={!isPasswordsValid || status==='sent'} className='sbutton' type='primary'>Change password</Button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;