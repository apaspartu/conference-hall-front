import { Button } from 'antd';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';

function HomePage() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            navigate('/schedule');
        }
    })
    return (
        <div className='home-back'>
            <Link to='/schedule' className='sclink'>
                <div>
                    <h1>Schedule</h1>
                </div>
            </Link>
            <div className='auth'>
                <Button type='primary' className='link'><Link to='/sign-in'>Sign In</Link></Button>
                <Button type='primary' className='link'><Link to='/sign-up' className='link'>Sign Up</Link></Button>
            </div>
        </div>
    );
}

export default HomePage;