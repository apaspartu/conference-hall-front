export type BaseAction = {
    type: string;
}

export type User = {
    id: string;
    name: string;
    email: string;
}

export type Event = {
    id: string;
    userId: string;
    isCompleted: string;
    title: string;
    description: string;
    color: string;
    user: User;
}

export type EventWithItems = Event & {
    items: Item[];
}

export type Item = {
    id: string;
    time: string;
    eventId: string | null;
    userId: string | null;
}

export type Day = {
    date: string;
    name: string;
    items: Item[];
}

export type Template = {
    year: number;
    month: number;
    startHour: number;
    endHour: number;
    step: number;
    days: Day[];
}
