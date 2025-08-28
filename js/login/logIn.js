function tratarErro(resposta, xhr = null) {
    // Caso venha do servidor como objeto
    if (resposta && typeof resposta === "object" && resposta.status) {
        if (resposta.status === "error") {
            const mensagemErro = resposta.erro && resposta.erro.trim() !== ""
                ? resposta.erro
                : "Ocorreu um erro desconhecido no servidor.";

            return {
                status: "error",
                mensagem: mensagemErro,
                resposta: resposta.resposta ?? null
            };
        }

        return {
            status: "success",
            mensagem: "Requisição concluída com sucesso.",
            resposta: resposta.resposta ?? null
        };
    }

    // Caso o erro venha do AJAX (xhr, status, errorThrown)
    if (xhr) {
        let mensagemErro = "Erro desconhecido.";

        switch (xhr.status) {
            case 400:
                mensagemErro = "Requisição inválida (400). Verifique os dados enviados.";
                break;
            case 401:
                mensagemErro = "Não autorizado (401). Email ou senha incorretos.";
                break;
            case 403:
                mensagemErro = "Acesso negado (403).";
                break;
            case 404:
                mensagemErro = "Recurso não encontrado (404).";
                break;
            case 409:
                mensagemErro = "Conflito de dados (409). Talvez já exista esse registro.";
                break;
            case 422:
                mensagemErro = "Erro de validação (422). Verifique os campos preenchidos.";
                break;
            case 500:
                mensagemErro = "Erro interno do servidor (500).";
                break;
            default:
                mensagemErro = `Erro na requisição (HTTP ${xhr.status}).`;
        }

        return {
            status: "error",
            mensagem: mensagemErro,
            resposta: null
        };
    }

    return {
        status: "error",
        mensagem: "Erro inesperado.",
        resposta: null
    };
}

function mostrarLoader() {
  document.getElementById("loader").style.display = "flex";
}

function esconderLoader() {
  document.getElementById("loader").style.display = "none";
}

$(document).ready(function () {
    $("#buttonLogin").on("click", function () {
        const email = $("#email").val();
        const password = $("#password").val();
        $.ajax({
            type: "POST",
            url: "http://localhost:9000/login",
            contentType: "application/json",
            data: JSON.stringify({
                email, password
            }),
            dataType: "json"
        })
            .done(function (res) {
                const resultado = tratarErro(res);

                if (resultado.status === "error") {
                    console.error("Erro tratado (log técnico):", resultado.mensagem);

                    // mensagem amigável para o usuário
                    $("#saida").html(`
                    <div style="padding:10px; border-radius:8px; background:#ffe0e0; color:#b00020;">
                    ⚠️ ${resultado.mensagem}
                    </div>`);
                } else {
                    console.log("Sucesso tratado:", resultado.resposta);
                    $("#saida").html(`
            <div style="padding:10px; border-radius:8px; background:#e0ffe0; color:#006400;">
                ✅ Login realizado com sucesso!
            </div>
        `);
                    // Redireciona após 2s
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 2000);
                }
            })
            .fail(function (xhr, status, error) {
                const resultado = tratarErro(null, xhr);
                console.error("Erro tratado (log técnico):", resultado.mensagem);

                let mensagemUsuario = "Ocorreu um problema. Tente novamente.";

                // mensagens mais amigáveis
                if (xhr.status === 401) {
                    mensagemUsuario = "Email ou senha incorretos.";
                } else if (xhr.status === 404) {
                    mensagemUsuario = "Servidor indisponível no momento. Tente mais tarde.";
                } else if (xhr.status === 500) {
                    mensagemUsuario = "Erro interno do sistema. Nossa equipe já foi notificada.";
                }

                $("#saida").html(`
                    <div>
                    ⚠️${mensagemUsuario}
                    </div>`);
            });
    })
});