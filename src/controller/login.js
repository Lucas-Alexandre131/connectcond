import { handleHttpResponse } from "../controller/errors/handleHttpResponse.js";
import { getItem, setItem } from "../controller/cookie/authCookie.js";

let loaderStartTime = null;

function mostrarLoader() {
    loaderStartTime = Date.now();
    const div = document.getElementById("loader");
    div.style.display = "flex";
}

function esconderLoader() {
    const elapsed = Date.now() - loaderStartTime;
    const minTime = 1500; // 1.5 segundos mínimos
    const wait = Math.max(0, minTime - elapsed);

    setTimeout(() => {
        const div = document.getElementById("loader");
        div.style.display = "none";
    }, wait);
}

$("#buttonLogin").on("click", function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    mostrarLoader();

    $.ajax({
        type: "POST",
        url: "http://localhost:9000/login",
        contentType: "application/json",
        data: JSON.stringify({ email, password }),
        dataType: "json"
    })
        .done(function (res) {
            try {
                const resultado = handleHttpResponse(res);

                if (!res.token) {
                    $("#saida").html(`
                <div>
                    ${res}
                    ${resultado}
                </div>
            `);
                } else {
                    $("#saida").html(`
                <div>
                    ✅ Login realizado com sucesso!
                    ${res.token}
                </div>
            `);

                    setItem("authToken", res.token); // token com seu valor
                    const token = getItem("authToken");

                    if (token) {
                        setTimeout(() => {
                            window.location.href = "/pages/syndic.html";
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error("Erro no processamento do login:", error);
                $("#saida").html(`
            <div">
                ⚠️ Ocorreu um erro inesperado. Tente novamente mais tarde.
            </div>
        `);
            } finally {
                esconderLoader();
            }
        })

        .fail(function (xhr) {
            const resultado = handleHttpResponse(null, xhr);

            // Fallback com mensagens mais amigáveis ao usuário
            let mensagemUsuario = resultado.mensagem;
            if (xhr.status === 401) mensagemUsuario = "Email ou senha incorretos.";
            else if (xhr.status === 404) mensagemUsuario = "Servidor indisponível no momento. Tente mais tarde.";
            else if (xhr.status === 500) mensagemUsuario = "Erro interno do sistema.";

            $(".mensagem-erro").html(`${mensagemUsuario}`);
            esconderLoader();
        });
});