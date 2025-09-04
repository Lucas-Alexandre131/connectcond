export function setItem(name, value) {
    localStorage.setItem(name, value); // cria ou sobrescreve um item
}

export function getItem(name) {
    return localStorage.getItem(name); // retorna o valor ou null
}