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

$("#buttonPostChat").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#idProduto").val();
    const horario = {id};
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: `https://connectcond-backend.onrender.com/public`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(horario),
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

$("#buttonPostChatMessage").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#idProduto").val();
    const horario = {id};
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: `https://connectcond-backend.onrender.com/public/message`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(horario),
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