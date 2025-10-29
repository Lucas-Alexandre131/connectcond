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

$("#buttonPostOrder").on("click", function (e) {
    const token = getItem("authToken");
    const shop_id = Number($("#orderShopId").val());
    const descreption = $("#orderDescription").val();
    const horario = { shop_id, descreption };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: `https://connectcond-backend.onrender.com/orders`,
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
}); // funcionando

$("#buttonUpdateOrder").on("click", function (e) {
    const token = getItem("authToken");
    const shop_id = Number($("#updateOrderId").val());
    const descreption = $("#updateOrderDescription").val();
    const status = $("#updateOrderStatus").val();
    const horario = { shop_id, descreption, status };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/orders/${shop_id}/status`,
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
}); // funcionando

$("#buttonGetOrderMy").on("click", function (e) {
    const token = getItem("authToken");
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/orders/my`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json"
    })
        .done(function (res) {
            try {
                // Insert into the div
                console.log("Payload:" + res);
                const rulesHtml = res.map(rule => `
                                <div class="rule-item">
                                    <p>${res.descreption}</p>
                                </div>
                            `).join("");

                $("#myOrdersList").html(rulesHtml);

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
            errorMessage(xhr.status);
            esconderLoader();
        });
}); // funcionando

$("#buttonGetOrderShopId").on("click", function (e) {
    const token = getItem("authToken");
    const shop_id = $("#shopOrdersId").val();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/shops/${shop_id}/orders`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json"
    })
        .done(function (res) {
            try {
                console.log("Resposta do backend:", res);

                // Se for um único produto
                const productHtml = `
                        <div>
                            <p>${res[shop_id].description ?? "Não possui descrição."}</p>
                        </div>
                    `;

                $("#shopOrdersList").html(productHtml);

            } catch (error) {
                console.error("Erro no processamento das regras:", error);
                $("#saida").html(`<div>⚠️ Ocorreu um erro inesperado. Tente novamente mais tarde.</div>`);
            } finally {
                esconderLoader();
            }
        })
        .fail(function (xhr) {
            errorMessage(xhr.status);
            esconderLoader();
        });
}); // funcionando