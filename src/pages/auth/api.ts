import axios from "axios";

// dev
// const ORIGIN = 'http://localhost:8080'

// prod
const ORIGIN = 'https://conferense-hall.fly.dev'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = ORIGIN;
axios.defaults.headers['Content-Type'] = 'application/json'

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
    const response = await axios.post('/auth/sign-in', {
            email,
            password
    })
    return response.data;
}

export async function refreshSession(): Promise<boolean> {
    let response: {accessToken: string} & {error: string};
    try {
        response = await (await axios.post('/auth/refresh')).data;
    } catch(e) {
        localStorage.removeItem('accessToken');
        return false;
    }

    if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        return true;
    }
    else {
        localStorage.removeItem('accessToken');
        return false;
    }
}

export async function forgotPassword(email: string) {
    const response = await fetch(ORIGIN + '/auth/forgot-password', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Origin': ORIGIN,
        },
        credentials: 'include',
        body: JSON.stringify({
            email: email
        })
    })

    return response.json();
}

export async function resetPassword(resetToken: string, newPassword: string) {
    const response = await fetch(ORIGIN + '/auth/reset-password', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Origin': ORIGIN,
        },
        credentials: 'include',
        body: JSON.stringify({
            resetToken: resetToken,
            newPassword: newPassword
        })

    });

    return response.json()
}

export async function profileLoader() {
    let response;
    try {
        response = await fetch('/profile', {
            method: 'GET',
            headers: {
                'Origin': ORIGIN,
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            },
        });
        
    } catch (e: any) {
        console.log(e.request.status);
        if (e.request.status === 403) {
            const refreshed = await refreshSession();
            if (refreshed) {
                response = await fetch('/profile', {
                    method: 'GET',
                    headers: {
                        'Origin': ORIGIN,
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
                    },
                });
                return response.json();
            } else {
                throw new Error('Forbidden resource');
            }
        }
    }
    return response?.json();
}