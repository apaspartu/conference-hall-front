import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function HomePage() {
    return (
        <div className='home-back'>
            <Link to='/schedule'>
                <div className='sclink'>
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