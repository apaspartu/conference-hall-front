import React, {useState, useEffect} from 'react';
import {Event} from './types';
import './event-view.css';
import { StringMappingType } from 'typescript';

function EventView({event, rect, userId, deleteHandler}: {event: Event, rect: DOMRect, userId: string, deleteHandler: Function}) {
    const viewWidth = 390;
    const [offsetX, offsetY] = [8, rect.height / 2];
    const [vpWidth, vpHeight] = [window.innerWidth, window.innerHeight];

    let style: any = {}, angStyle, topOrBottom: string;

    if (vpWidth - rect.right > 400) {
        style.left = rect.x + offsetX + rect.width + 'px';
        angStyle = 'ang-left';
    } else {
        style.left = rect.right - offsetX - viewWidth - rect.width + 'px';
        angStyle = 'ang-right';
    }

    if (vpHeight - rect.bottom > 320) {
        style.top = rect.top - 10 + 'px';
        topOrBottom = 'top';
    }
    else {
        style.bottom = vpHeight - rect.bottom - 10 + 'px';
        topOrBottom = 'bottom';
    }

    return (
        <div className='event-view' style={{...style, width: viewWidth + 'px'}}>
            <div className={angStyle} style={{[topOrBottom]: offsetY + 0 + 'px'}}></div>
            <div className='evback'></div>
            <div className='evinfo'>
                <h2>{event.title}</h2>
                <span className='eauthor'>
                    <span>
                    <h3>Author: </h3>
                    <h3>{event.user.name}</h3>
                    </span>
                    <a href={'mailto:' + event.user.email}><h3>{event.user.email}</h3></a>
                </span>
                <div className='evtext'><p>{event.description}</p></div>
            </div>
            {userId && userId === event.userId && <span className="material-symbols-outlined delbut" 
                onClick={() => deleteHandler(event.id)}>delete</span>}
        </div>
    );
}

export default EventView;