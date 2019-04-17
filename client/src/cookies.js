
export function setCookie(cookieName, value, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toGMTString()}`;
    document.cookie = `${cookieName}=${value}; ${expires}`;
}

export function getCookie(cookieName) {
    const cookiesArray = document.cookie.split('; ');
    for (let i = 0; i < cookiesArray.length; i++) {
        const nameValueArray = cookiesArray[i].split('=');
        if (nameValueArray[0] === cookieName) {
            return nameValueArray[1];
        }
    }
    return '';
}
