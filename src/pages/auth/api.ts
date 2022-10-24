import { createCipheriv } from "crypto";

const ORIGIN = 'http://localhost:8080'

interface ErrorInterface {
    error: string;
    message: string;
    statusCode: number;
}

export async function verifyEmail(email: string): Promise<true | ErrorInterface> {
    const response = await fetch(ORIGIN + '/auth/verify-email', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Origin': ORIGIN
        },
        body: JSON.stringify({email: email})
    })
    return response.json();
}

export async function createProfile(name: string, password: string, inviteToken: string) {
    const response = await fetch(ORIGIN + '/auth/create-user', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Origin': ORIGIN
        },
        body: JSON.stringify({
            name: name,
            password: password,
            inviteToken: inviteToken
        })
        
    })
    return response.json();
}

export async function signIn(email: string, password: string) {
    const response = await fetch(ORIGIN + '/auth/sign-in', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Origin': ORIGIN
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
        
    })
    return response.json();
}