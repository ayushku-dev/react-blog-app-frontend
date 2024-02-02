const storeInSession = (key, value) => {
    sessionStorage.setItem(key, value);
}

const lookInSesseion = (key) => {
    return sessionStorage.getItem(key);
}

const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
}

const logOutUser = () => {
    sessionStorage.clear();
}

export { storeInSession, lookInSesseion, removeFromSession, logOutUser }