// newUser.js
import { handleHttpResponse } from "../controller/errors/handleHttpResponse.js";
import { getItem, setItem } from "../controller/cookie/authCookie.js";
import { errorMessage } from "../services/errorMessage.js";

let loaderStartTime = null;

function mostrarLoader() {
    loaderStartTime = Date.now();
    const div = document.getElementById("loader");
    if (div) div.style.display = "flex";
}

function esconderLoader() {
    const elapsed = Date.now() - loaderStartTime;
    const minTime = 1500;
    const wait = Math.max(0, minTime - elapsed);

    setTimeout(() => {
        const div = document.getElementById("loader");
        if (div) div.style.display = "none";
    }, wait);
}

$(document).ready(function () {
    const $btn = $("#btnCadastro");
    const token = getItem('authToken');

    if (!$btn.length) {
        console.warn("Botão de cadastro não encontrado.");
        return;
    }

    $btn.on("click", function (e) {
    e.preventDefault();

    const cpf = $("#cpf").val().replace(/\D/g, '');
    const role = $("#role").val();
    const password = $("#password").val();
    const name = $("#name").val();
    const email = $("#email").val();
    const picture = $("#picture").val();

    mostrarLoader();

    if (!cpf || !role || !password || !name || !email) {
        $("#saida").html(`<div>⚠️ Preencha todos os campos obrigatórios.</div>`);
        esconderLoader();
        return;
    }

    const userData = { cpf, role, password, name, email, picture };
    console.log("Enviando dados:", userData);

    $.ajax({
        type: "POST",
        url: "https://connectcond-backend.onrender.com/account",
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(userData),
        dataType: "json"
    })
    .done(function (res) {
        try {
            const resultado = handleHttpResponse(res);

            if (!res.token) {
                $("#saida").html(`
                    <div>
                        ❌ Erro ao obter token.<br/>
                        <pre>${JSON.stringify(res, null, 2)}</pre>
                        ${resultado}
                    </div>
                `);
            } else {
                $("#saida").html(`<div>✅ Cadastro realizado com sucesso! Redirecionando...</div>`);
                setItem("authToken", res.token);
                setTimeout(() => window.location.href = "/src/pages/syndic.html", 2000);
            }
        } catch (error) {
            console.error("Erro no processamento:", error);
            $("#saida").html(`<div>⚠️ Erro inesperado. Tente novamente.</div>`);
        } finally {
            esconderLoader();
        }
    })
    .fail(function (xhr) {
        console.error("Erro na requisição:", xhr.responseJSON || xhr.responseText);
        const responseText = xhr.responseJSON?.message || "Erro desconhecido.";
        $("#saida").html(`<div>❌ Erro ${xhr.status}: ${responseText}</div>`);
        esconderLoader();
    });
});
});