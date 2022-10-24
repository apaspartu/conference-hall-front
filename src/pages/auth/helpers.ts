export function validateEmail(email: string): string | false {
    return !!String(email.trim())
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) ? email.toLocaleLowerCase() : false;
}

export function saveAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
}