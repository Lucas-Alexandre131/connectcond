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

$("#buttonGetProducts").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#idProduto").val();
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/products/${id}`,
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
});

$("#buttonPostProducts").on("click", function (e) {
    const token = getItem("authToken");
    const name = $("#nameProduto").val();
    const descreption = $("#descricaoProduto").val();
    const price = $("#precoProduto").val();
    const product_type = $("#nameProduto").val();
    const quantiy =$("#quantidadeProduto").val();
    const produto = { name, cnpj, descreption, price, product_type, quantiy}
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: "https://connectcond-backend.onrender.com/products",
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(produto),
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

$("#buttonUpdateProducts").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#idProduto").val();
    const name = $("#nameProduto").val();
    const descreption = $("#descricaoProduto").val();
    const price = $("#precoProduto").val();
    const product_type = $("#nameProduto").val();
    const quantiy =$("#quantidadeProduto").val();
    const produto = { name, cnpj, descreption, price, product_type, quantiy}
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/products/${id}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(produto),
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

$("#buttonDelleteProducts").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#idProduto").val();
    const name = $("#nameProduto").val();
    const descreption = $("#descricaoProduto").val();
    const price = $("#precoProduto").val();
    const product_type = $("#nameProduto").val();
    const quantiy =$("#quantidadeProduto").val();
    const produto = { name, cnpj, descreption, price, product_type, quantiy}
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "DELETE",
        url: `https://connectcond-backend.onrender.com/products/${id}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(produto),
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

$("#buttonGetShopProducts").on("click", function (e) {
    const token = getItem("authToken");
    const shopId = $("#idShop").val();
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/shops/${shopId}/products`,
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
});