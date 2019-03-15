
export function setCookie(c_name, value, exdays){
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    const expires = "expires=" + d.toGMTString();
    document.cookie = c_name + "=" + value + "; " + expires;
}

export function getCookie(c_name) {
    let cookiesArray = document.cookie.split("; ");
    for (let i = 0; i < cookiesArray.length; i++) {
        const nameValueArray = cookiesArray[i].split("=");
        if (nameValueArray[0] === c_name) {
            return nameValueArray[1];
        }
    }
    return "";
}
