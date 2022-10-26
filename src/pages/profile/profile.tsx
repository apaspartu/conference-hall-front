import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './profile.css';


function ProfilePage() {
    const profile = useLoaderData();
    return (
        <div className='p-page'>
            <div className='view'>
                {JSON.stringify(profile)}
            </div>
        </div>
    );
}

export default ProfilePage;