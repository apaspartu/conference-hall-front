import { BaseAction, EventWithItems, Item, Template } from "./types";


type SetAction = {
    type: 'set';
    template: Template;
}

type ReserveAction = {
    type: 'reserve';
    id: string;
    eventId: string;
    userId: string;
}

type CreateAction = {
    type: 'create';
    items: Item[];
    userId: string;
}

type DeleteAction = {
    type: 'delete';
    eventId: string;
}

type GetAction = {
    type: 'get';
    event: EventWithItems;
}

type ClearAction = {
    type: 'clear';
}

type ToggleItemAction = {
    type: 'toggle-item';
    itemId: string;
}

type Action = SetAction | ReserveAction | CreateAction | DeleteAction | GetAction | ClearAction | ToggleItemAction;

export default function templateReducer(draft: Template | null, action: Action) {
    switch (action.type) {
        case 'set': {
            return action.template;
        }
        case 'reserve': {
            for (const day of draft!.days) {
                for (const item of day.items) {
                    if (item.id === action.id) {
                        if (item.eventId === null) {
                            item.eventId = action.eventId;
                            item.userId = action.userId;
                        } else {
                            item.eventId = null;
                        }
                        break;
                    }
                }
            }
            break;
        }
        case 'create': {
            for (const day of draft!.days) {
                for (const item of day.items) {
                    for (const newItem of action.items) {
                        if (item.id === newItem.id) {
                            item.eventId = newItem.eventId;
                            item.userId = action.userId;
                        }
                    }
                }
            }
            break;
        }
        case 'delete': {
            for (const day of draft!.days) {
                for (const item of day.items) {
                    if (item.eventId === action.eventId) {
                        item.eventId = null;
                    }
                }
            }
            break;
        }
        case 'get': {
            for (const day of draft!.days) {
                for (const item of day.items) {
                    for (const newItem of action.event.items) {
                        if (item.id === newItem.id) {
                            item.eventId = newItem.eventId;
                            item.userId = newItem.userId;
                            break;
                        }
                    }
                }
            }
            break;
        }
        case 'clear': {
            for (const day of draft!.days) {
                for (const item of day.items) {
                    item.eventId = null;
                }
            }
            break;
        }
        case 'toggle-item': {
            for (const day of draft!.days) {
                for (const item of day.items) {
                    if (item.id === action.itemId) {
                        item.eventId = null;
                        item.userId = null;
                    }
                }
            }
            break;
        }
        default: {
            throw new Error('Unknown action: ' + (action as BaseAction).type);
        }
    }
}