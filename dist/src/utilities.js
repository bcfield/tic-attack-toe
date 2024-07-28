export function getElementById(id) {
    return document.getElementById(id);
}

export function addEventListenerToElement(element, event, callback) {
    if (element) {
        element.addEventListener(event, callback);
    }
}

export function setElementText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

export function setElementStyle(element, property, value) {
    if (element) {
        element.style[property] = value;
    }
}
