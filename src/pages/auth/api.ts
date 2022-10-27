import axios from "axios";

// dev
const ORIGIN = 'http://localhost:8080'

// prod
// const ORIGIN = 'https://conferense-hall.fly.dev'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = ORIGIN;
axios.defaults.headers.common['Content-Type'] = 'application/json'

interface ErrorInterface {
    error: string;
    message: string;
    statusCode: number;
}

export async function verifyEmail(email: string): Promise<true | ErrorInterface> {
    const response = await axios.post(ORIGIN + '/auth/verify-email', {email: email})
    return response.data;
}

export async function createProfile(name: string, password: string, inviteToken: string) {
    const response = await axios.post(ORIGIN + '/auth/create-user', {
            name: name,
            password: password,
            inviteToken: inviteToken
        
    })
    return response.data;
}

export async function signIn(email: string, password: string) {
    const response = await axios.post('/auth/sign-in', {
            email,
            password
    })
    return response.data;
}

export async function refreshSession(): Promise<boolean> {
    if (localStorage.getItem('accessToken') === undefined) {
        window.location.replace('/sign-in')
        return false;
    }
    let response: {accessToken: string};
    try {
        response = (await axios.post('/auth/refresh')).data;
    } catch(e) {
        if (e.response.statusText === 'Forbidden') {
            localStorage.removeItem('accessToken');
            return false;
        } else {
            throw e;
        }
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

// private
export async function updateProfile(name: string) {
    const data = await requestPrivate(() => axios.patch('/profile/update', {
            name: name
        }, {
            headers: {'Authorization':  'Bearer ' + localStorage.getItem('accessToken'),}
        }
    ))
    return data;

}
// private
export async function changePassword(oldPassword: string, newPassword: string) {
    const data = await requestPrivate(() => axios.patch('/profile/change-password', {
            oldPassword,
            newPassword
        }, {
            headers: {'Authorization':  'Bearer ' + localStorage.getItem('accessToken'),}
        }
    ))
    return data;

}

export interface ProfileInfo {
    name: string;
    email: string;
}

export async function loadProfile() {
    let data;
    try {
        data = await requestPrivate(() => axios.get('/profile', {
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),}
        }));
    } catch(e) {
        return window.location.replace('/sign-in')
    }
    return data;

}

// try async func with fetch, if forbidden, refresh session and try again, if again forbidden redirect on sign-in
export async function requestPrivate(func: Function) {
    try { // if accessToken was not expired
        const response = await func();
        return response.data;
    } catch (e) { // if it was expired
        if (e.response.statusText === 'Forbidden') {
            if (await refreshSession() === true) {
                const response = await func();
                return response.data;
            } else {
                throw e;
            }
        } else {
            localStorage.removeItem('accessToken')
            throw e;
        }
    }
}