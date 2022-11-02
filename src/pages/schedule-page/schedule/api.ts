import { io, Socket } from "socket.io-client";
import { refreshSession } from "../../auth/api";

// const SOCKET_ORIGIN = 'http://localhost:8080';
const SOCKET_ORIGIN = 'https://conferense-hall.fly.dev'


function emit(socket: Socket, event: string, ...data: any) {
    return new Promise((resolve, reject) => {
        if (!socket) {
            reject('No socket connection');
        } else {
            socket.emit(event, ...data, (response: {error: string}) => {
                if (response.error) {
                    reject(response);
                } else {
                    resolve(response);
                }
            });
        }
    })
}


export function getSocket() {
    return io(SOCKET_ORIGIN, {
        withCredentials: true,
        extraHeaders: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
    });
}


async function emitOnPrivate(socket: Socket, event: string, ...data: any) {
    try {
        return await emit(socket, event, ...data);
    } catch (e: any) {
        if (e.error === 'No socket connection') {
            socket = getSocket();
            try {
                return await emit(socket, event, ...data);
            } catch (e) {
                throw e;
            }
        } else if (e.error === 'Not authorized') {
            socket.disconnect()
            socket = getSocket();
            try {
                return await emit(socket, event, ...data);
            } catch (e) {
                throw e;
            }
        } else {
            throw e;
        }
    }
}


export async function reserveItem(socket: Socket, itemId: string) {
    return await emitOnPrivate(socket, 'reserve-item', {itemId});
}

export async function createEvent(socket: Socket, title: string, description: string, color: string) {
    return await emitOnPrivate(socket, 'create-event', {title, description, color});
}

export async function deleteEvent(socket: Socket, eventId: string) {
    return await emitOnPrivate(socket, 'delete-event', {eventId});
}