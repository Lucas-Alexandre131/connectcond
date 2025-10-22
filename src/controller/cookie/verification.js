import { getCookie } from "./authCookie.js";


// função responsável por verificar o token de acesso ao carregar a pagina html
export function verificationToken() {
    try {
        const token = getCookie("authToken");
        if (!token) {
            return {
                status: "401",
                message: "Unauthorezed",
                error: message.error
            }
        }

        if (token) {
            console.log("Token encontrado, iniciando verificação...");
            


            /*
                console.log(token + isToken);
                console.log(typeof (token) + typeof (isToken));
            */
        }
    } catch (error) {
        return { status: 500, message: "Erro interno do servidor.", error: error.message };
    }
} // mudar o local de armazenamento para localstorage antes de iniciar essa veficação.