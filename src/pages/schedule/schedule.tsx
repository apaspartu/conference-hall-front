import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import './schedule.css'

function Schedule() {
    return (
        <div className='s-page'>
            <Link to='/profile'><Button type='default' className='go-schedule' icon={<img src='https://www.svgrepo.com/show/311063/person.svg'/>}>Profile</Button></Link>
            <h1>Schedule</h1>
        </div>
    )
}

export default Schedule;