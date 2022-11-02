import { BaseAction, Event, EventWithItems, Item } from './types';

type SetAction = {
    type: 'set';
    events: Event[];
}

type CreateAction = {
    type: 'create';
    event: Event & {items?: Item[]};
}

type DeleteAction = {
    type: 'delete';
    eventId: string;
}

type GetAction = {
    type: 'get';
    event: Event & {items?: Item[]};
}

type ClearAction = {
    type: 'clear'
}

type Action = SetAction | CreateAction | DeleteAction | GetAction | ClearAction;


export default function eventsReducer(draft: Event[] | null, action: Action) {
    switch (action.type) {
        case 'set': {
            return action.events;
        }
        case 'create': {
            delete action.event.items;
            draft!.push(action.event)
            break;
        }
        case 'delete': {
            for (let eventIndex = 0; eventIndex < draft!.length; eventIndex++) {
                if (draft![eventIndex].id === action.eventId) {
                    draft!.splice(eventIndex, 1)
                    break;
                }
            }
            break;
        }
        case 'get': {
            delete action.event.items;
            draft!.push(action.event);
            break;
        }
        case 'clear': {
            return [];
        }
        default: {
            throw new Error('Unknown action: ' + (action as BaseAction).type);
        }
    }
}
