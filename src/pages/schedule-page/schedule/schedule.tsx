import React, {useState, useEffect} from 'react';
import { getSchedule } from '../../auth/api';
import './schedule.css';

import { Event, Template } from './types';
import { io, Socket } from 'socket.io-client';
import moment, { Moment } from 'moment';
import {Button, DatePicker, Input} from 'antd';
import { motion } from 'framer-motion';
import {Reducer, useImmer, useImmerReducer} from 'use-immer';
import templateReducer from './template-reducer';
import eventsReducer from './events-reducer';
import { EventWithItems, Item } from './types';
import DenseArrow from './dense-arrow';
import {isDirectNextItem, itemIdsComparator} from './helpers';
import * as api from './api';
import CreateEventFrom from './create-form';
import EventView from './event-view';

let socket: Socket = api.getSocket();

interface ItemProps {
    id: string;
    pointerDownHandler: Function;
    pointerUpHandler: Function;
    hoverHandler: Function;
    status: string;
}

function ItemComponent({id, pointerDownHandler,  pointerUpHandler, hoverHandler, status}: ItemProps) {
    const [style, setStyle] = useState('');
    const classes = ['item', style]
    if (status === 'reserved') {
        classes.push('item-reserved')
    } else if (status === 'taken') {
        classes.push('item-taken')
    }
    return (
        <div onPointerDown={() => pointerDownHandler(id)} onPointerUp={() => pointerUpHandler(id)} 
        onPointerOver={(e) => {
            hoverHandler(id, e.currentTarget.getBoundingClientRect());
            if (status === 'free') {
                setStyle('item-hovered')
            } else {
                setStyle('');
            }
        }} onPointerOut={() => setStyle('')}
            className={classes.join(' ')} >
            {id.slice(-5)}
        </div>
    );
}


function Schedule({profile}: {profile: any}) {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [template, dispatchTemplate] = useImmerReducer<Template | null>((templateReducer as Reducer), null);
    const [events, dispatchEvents] = useImmerReducer<Event[] | null>((eventsReducer as Reducer), null);

    const [eventView, setEventView] = useState<null | {event: Event; itemId: string; rect: DOMRect}>(null);

    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');

    const effectOnReserve = (id: string) => {
        api.reserveItem(socket, id).then((res) => {

        })
        .catch((e) => {
            setError(e.error);
            setSelectedItems(selectedItems.copy().clear())
            setIsHolded(false);
        })
    }

    const [selectedItems, setSelectedItems] = useState(new DenseArrow((a, b) => isDirectNextItem(a, b, 30), itemIdsComparator, 
        [effectOnReserve], [effectOnReserve]));
    const [isHolded, setIsHolded] = useState(false);

    useEffect(() => {
        const date = new Date();
        getSchedule(date.getFullYear(), date.getMonth() + 1)
        .then((res) => {
            dispatchTemplate({
                type: 'set',
                template: res.template
            });
            dispatchEvents({
                type: 'set',
                events: res.events
            });
            setStatus('loaded')
        })
        .catch((e) => {
            setError('Loading Failed')
        })

        if (socket) {
            socket.disconnect();
            socket = api.getSocket();
        }

        socket.on('connect', () => {
            setIsConnected(true);
        });
      
          socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('reserve-item', (data: Item) => {
            dispatchTemplate({
                type: 'reserve',
                id: data.id,
                eventId: data.eventId,
                userId: data.userId,
            })
        })

        socket.on('create-event', (data: EventWithItems) => {
            dispatchTemplate({
                type: 'create',
                items: data.items,
                userId: data.userId
            })
            dispatchEvents({
                type: 'create',
                event: data
            })
        })

        socket.on('delete-event', (data: string) => {
            dispatchEvents({
                type: 'delete',
                eventId: data
            })
            dispatchTemplate({
                type: 'delete',
                eventId: data
            })
        })

        socket.on('exception', (e) => {
            console.log(e)
        })

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('reserve-item');
            socket.off('create-event');
            socket.off('delete-event');
            socket.off('get-events');
          };
    }, [])


    useEffect(() => {
        if (profile && template) {
            let initSelectedItems = [];
            for (const day of template.days) {
                for (const item of day.items) {
                    let hasEvent = false;
                    for (const event of events!) {
                        if (event.id === item.eventId) {
                            hasEvent = true;
                            break;
                        }
                    }
                    if (!hasEvent && item.userId === profile.id){
                        initSelectedItems.push(item.id);
                    }
                }
            }
            let sin = selectedItems.copy();
            sin.stack = initSelectedItems;
            setSelectedItems(sin)
        }
    }, [profile])

    if ((!template && !error) || status === 'loading') {
        return (
            <div className='sspinner'>
                <img src='https://cdn-icons-png.flaticon.com/512/2999/2999463.png'/>
            </div>
        );
    }
    if (!template && error === 'Loading Failed') {
        return (
            <div className='loadError'><h1>Failed to load schedule. Try again</h1></div>
        );
    }
    if (error === 'Invalid month or year!') {
        return (
            <div className='loadError'><h1>Invalid month or year! Try again</h1></div>
        );
    }

    const handleMonthPick = (date: Moment | null, dateString: string) => {
        date = moment(dateString, 'YYYY-MM');
        if (!date.year() || !date.month()) {
            setError('Invalid month or year!');
            setTimeout(() => setError(''), 2000);
            return;
        }

        setStatus('loading');
        getSchedule(date.year(), date.month() + 1)
        .then((res) => {
            dispatchTemplate({
                type: 'set',
                template: res.template
            });
            dispatchEvents({
                type: 'set',
                events: res.events
            });
            setStatus('loaded')
        })
        .catch((e) => {
            setError('Loading Failed')
        })
    }

    const getItemEvent = (id: string) => {
        for (const day of template!.days) {
            for (const item of day.items) {
                if (item.id === id) {
                    for (const event of events!) {
                        if (event.id === item.eventId) {
                            return event;
                        }
                    }
                    return null;
                }
            }
        }
        return null;
    }

    const handleItemPress = (id: string) => {
        if (localStorage.getItem('accessToken')) {
            setIsHolded(true);
            let newState = selectedItems.copy();
            newState.toggle(id)
            setSelectedItems(newState);
        }
    }

    const handleItemRelease = (id: string) => {
        setIsHolded(false);
    }

    const handleItemHover = (id: string, itemClientRect: DOMRect) => {
        if (isHolded) {
            if (selectedItems.has(id)) {
                let newState = selectedItems.copy();
                newState.toggle(id)
                setSelectedItems(newState);
            } else {
                let newState = selectedItems.copy();
                newState.toggle(id)
                setSelectedItems(newState);
            }
        }
        else {
            if (eventView && eventView.itemId !== id) {
                const event = getItemEvent(id);
                if (event) {
                    setEventView({event, itemId: id, rect: itemClientRect});
                } else {
                    setEventView(null);
                }
            } else if (!eventView) {
                const event = getItemEvent(id);
                if (event) {
                    setEventView({event, itemId: id, rect: itemClientRect});
                }
            }
        }
    }


    const handleCreateEvent = () => {
        setStatus('editing')
    }

    const hadleFormSubmit = (title: string, description: string) => {
        api.createEvent(socket, title, description, 'blue')
        .then(() => {
            setStatus('loaded')
            setSelectedItems(selectedItems.copy().clear())
        })
        .catch((e) => {
            setError(e);
            setStatus('loaded')
            setSelectedItems(selectedItems.copy().clear())
        })
    }

    const handleEventDelete = (eventId: string) => {
        api.deleteEvent(socket, eventId);
        setEventView(null);
    }

    let scheduleView = [];
    for (const day of template!.days) {
        const items = day.items.map((item: any) => {
            let status;
            if (item.eventId) {
                status = 'reserved'
                for (const event of events!) {
                    if (item.eventId === event.id) {
                        status = 'taken'
                        break;
                    }
                }
            } else {
                status = 'free';
            }
            
            return <ItemComponent id={item.id} key={item.time} status={status} pointerDownHandler={handleItemPress}
                hoverHandler={handleItemHover} pointerUpHandler={handleItemRelease} />
        })
        
        scheduleView.push(
            <li className='day' key={day.date}>
                <header>
                    <h3>{day.date}</h3>
                    <h4>{day.name}</h4>
                </header>
                <ul className='items'>
                    {items}
                </ul>
            </li>
        );
    }

    const viewMonth = moment(`${template!.year}-${template!.month}`, 'YYYY/MM');

    return  (
        <div className='schedule'>
            {status === 'editing' && 
                <CreateEventFrom handleHide={() => setStatus('loaded')} hadleSubmit={hadleFormSubmit}/>
            }
            {eventView && 
                <EventView event={eventView.event} rect={eventView.rect} userId={profile?.id} deleteHandler={handleEventDelete} />
            }
            <div className='sc-controls'>
                <Button onClick={handleCreateEvent} disabled={selectedItems.length === 0} className='create-event'>Create event</Button>
                <span className='monthpan'>
                    <label>Select month:</label>
                    <DatePicker onChange={handleMonthPick} defaultValue={viewMonth} picker="month" className='month-picker'/>
                </span>
            </div>
            <ul className='scheduleView' onPointerUp={() => setIsHolded(false)}>
                {scheduleView}
            </ul>
        </div>
    );
}

export default Schedule;