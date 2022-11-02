import React, {useState} from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from 'antd';

import './create-form.css'

function CreateEventFrom({handleHide, hadleSubmit}: any) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        hadleSubmit(title, description);
    }

    const isEmpty = !!!title || !!!description;

    return (
        <motion.div className='eveback' animate={{opacity: 1}} transition={{duration: 0.1}} initial={{opacity: 0}}>
            <div onClick={handleHide} className='flatback'></div>
            <motion.div className='event-editor' animate={{translateY: -30}} initial={{translateY: 70}}>
                <h1>Create event</h1>
                <label>Title</label>
                <Input value={title} onInput={(e: any) => setTitle(e.target.value)} placeholder='Title' className='titlinp'/>
                <label>Description</label>
                <Input.TextArea value={description} onInput={(e: any) => setDescription(e.target.value)} rows={7} placeholder='Description' className='descinp'/>
                <Button onClick={handleSubmit} disabled={isEmpty} type='default' className='create'>Create</Button>
            </motion.div>
        </motion.div>
    )
}

export default CreateEventFrom;