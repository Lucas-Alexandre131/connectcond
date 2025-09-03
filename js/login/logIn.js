import { handleHttpResponse } from "../errors/handleHttpResponse.js";

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
    },wait);
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
            const resposta = res;
            console.log(resposta);
            const resultado = handleHttpResponse(res);

            if (resposta.token === null) {
                $("#saida").html(`
                    <div">
                        ${resposta}
                        ${resultado}
                    </div>
                `);
            } else {
                $("#saida").html(`
                    <div">
                        ✅ Login realizado com sucesso!
                        ${resposta.token}
                    </div>
                `);
                setTimeout(() => window.location.href = "/index.html", 2000); // 2 segundos até o redirecionamento para a pagina inicial
            }

            esconderLoader();
        })
        .fail(function (xhr) {
            const resultado = handleHttpResponse(null, xhr);

            // Fallback com mensagens mais amigáveis ao usuário
            let mensagemUsuario = resultado.mensagem;
            if (xhr.status === 401) mensagemUsuario = "Email ou senha incorretos.";
            else if (xhr.status === 404) mensagemUsuario = "Servidor indisponível no momento. Tente mais tarde.";
            else if (xhr.status === 500) mensagemUsuario = "Erro interno do sistema.";

            $("#saida").html(`${mensagemUsuario}`);
            esconderLoader();
        });
});