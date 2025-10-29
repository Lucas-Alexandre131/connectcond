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

$("#buttonPostSpecial").on("click", function (e) {
    const token = getItem("authToken");
    const name = $("#specialHallName").val();
    const descreption = $("#specialHallDescription").val();
    const capacity = Number($("#specialHallCapacity").val());
    const available = Boolean($("#specialHallAvailable").val());
    const special = { name, descreption, capacity, available };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: `https://connectcond-backend.onrender.com/special-halls`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(special),
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
}); // funcionando

$("#buttonGetSpecial").on("click", function (e) {
    const token = getItem("authToken");
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/special-halls`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json"
    })
        .done(function (res) {
            try {
                console.log("Payload:", res);

                const rulesHtml = (res || []).map(rule => `
            <div class="rule-item">
                <p><strong>Número da reserva: ${rule.id}</strong></p>
                <p><strong>${rule.name}</strong></p>
                <p>${rule.description || "Sem descrição"}</p>
            </div>
        `).join("");

                $("#specialHallsList").html(rulesHtml);

            } catch (error) {
                console.error("Erro no processamento das regras:", error);
                $("#saida").html(`
            <div>
                ⚠️ Ocorreu um erro inesperado. Tente novamente mais tarde.
            </div>
        `);
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
}); // funcionando

$("#buttonUpdateSpecial").on("click", function (e) {
    const token = getItem("authToken");
    const id = Number($("#updateSpecialHallId").val());
    const name = $("#updateSpecialHallName").val();
    const descreption = $("#updateSpecialHallDescription").val();
    const capacity = Number($("#updateSpecialHallCapacity").val());
    const available = Boolean($("#updateSpecialHallAvailable").val());
    const special = { name, descreption, capacity, available };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/special-halls/${id}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(special),
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
}); // funcionando

$("#buttonDeletteSpecial").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#deleteSpecialHallId").val();
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "DELETE",
        url: `https://connectcond-backend.onrender.com/special-halls/${id}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
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
}); // funcionando