import React, {useState, useEffect} from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import './schedule-page.css'
import { loadProfile, logout, Profile } from '../auth/api';
import Schedule from './schedule/schedule';

function SchedulePage() {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        loadProfile(false)
        .then((res: Profile | null) => {
            if (res) {
                setProfile(res)
            }
        })
        .catch((e) => {
            
        })
    }, []);

    const handleLogout = () => {
        logout()
        .then((res) => {
            setProfile(null);
        })
        .catch(() => {
            setProfile(null);
        })
    }

    return (
        <div className='s-page'>
            <nav>
                <Link to='/schedule'><h1>Conference Hall <span>Schedule</span></h1></Link>
                <div className='pcontrols'>
                    {profile ?
                    <>
                    <Link to='/profile'>
                    <Button type='default' className='go-profile' icon={
                        <img src='https://cdn-icons-png.flaticon.com/512/8104/8104724.png'/>}>{profile.name}</Button>
                    </Link>
                    <Button onClick={handleLogout} type='link' className='logoutb'>Logout</Button>
                    </>
                    :
                    <Link to='/sign-in'>
                    <Button type='default' className='go-profile'>Sign in</Button>
                    </Link>
                    }
                </div>
            </nav>
            <Schedule profile={profile}/>
        </div>
    )
}

export default SchedulePage;