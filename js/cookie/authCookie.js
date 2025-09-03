export function setCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/"; // cria um cookie e seu valor
}

export function getCookie(name) {
    return (
        document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))?.split('=')[1] || null
    );
}