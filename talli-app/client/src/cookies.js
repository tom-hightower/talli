
export function setCookie(c_name, value, exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = c_name + "=" + value + "; " + expires;
}

export function getCookie(c_name) {
    var cookiesArray = document.cookie.split("; ");
    for (var i = 0; i < cookiesArray.length; i++) {
        var nameValueArray = cookiesArray[i].split("=");
        if (nameValueArray[0] === "UserID") {
            return nameValueArray[1];
        }
    }
    return "";
}

