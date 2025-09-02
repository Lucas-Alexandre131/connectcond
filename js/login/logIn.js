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

let loaderStartTime = null;

function mostrarLoader() {
    loaderStartTime = Date.now();
    document.getElementById("loader").style.display = "flex";
}

function esconderLoader() {
    const elapsed = Date.now() - loaderStartTime;
    const minTime = 1500; // 1.5 segundos mínimos
    const wait = Math.max(0, minTime - elapsed);

    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
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
            const resultado = tratarErro(res);

            if (resultado.status === "error") {
                $("#saida").html(`
              <div style="padding:10px; border-radius:8px; background:#ffe0e0; color:#b00020;">
                ⚠️ ${resultado.mensagem}
              </div>
            `);
            } else {
                $("#saida").html(`
              <div style="padding:10px; border-radius:8px; background:#e0ffe0; color:#006400;">
                ✅ Login realizado com sucesso!
              </div>
            `);
                setTimeout(() => window.location.href = "/index.html", 2000);
            }

            esconderLoader(); // <- só chama aqui no fim
        })
        .fail(function (xhr) {
            const resultado = tratarErro(null, xhr);

            let mensagemUsuario = "Ocorreu um problema. Tente novamente.";
            if (xhr.status === 401) mensagemUsuario = "Email ou senha incorretos.";
            else if (xhr.status === 404) mensagemUsuario = "Servidor indisponível no momento. Tente mais tarde.";
            else if (xhr.status === 500) mensagemUsuario = "Erro interno do sistema.";

            $("#saida").html(`
          <div style="padding:10px; border-radius:8px; background:#ffe0e0; color:#b00020;">
            ⚠️ ${mensagemUsuario}
          </div>
        `);

            esconderLoader(); // <- idem aqui
        });
});