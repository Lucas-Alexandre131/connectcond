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
    const shop_id = $("#getProductId").val();
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/products/${shop_id}`,
        contentType: "application/json",
        headers: { Authorization: `Bearer ${token}` },
        dataType: "json"
    })
        .done(function (res) {
            try {
                console.log("Resposta do backend:", res[0]);

                // Se for um único produto
                const productHtml = `
                <div>
                    <p>${res.product_name}</p>
                </div>
            `;

                $("#productList").html(productHtml);

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

$("#buttonPostProducts").on("click", function (e) {
    e.preventDefault();
    mostrarLoader();

    const token = getItem("authToken");
    const shop_id = Number($("#productShopId").val());
    const product_name = $("#productName").val();
    const description = $("#productDescription").val().trim();
    const price = parseFloat($("#productPrice").val());
    const product_type = $("#productType").val();
    const quantity = Number($("#productQuantity").val());

    const produto = { shop_id, product_name, description, price, product_type, quantity };

    if (!shop_id || !product_name || !description || !price || !product_type || !quantity) {
        $("#saida").html("<div>❌ Preencha todos os campos corretamente.</div>");
        esconderLoader();
        return;
    }

    $.ajax({
        type: "POST",
        url: "https://connectcond-backend.onrender.com/products",
        contentType: "application/json",
        headers: { Authorization: `Bearer ${token}` },
        data: JSON.stringify(produto),
        dataType: "json"
    })
        .done(res => {
            $("#saida").html("<div>✅ Produto cadastrado com sucesso!</div>");
            console.log("Resposta do backend:", res);
        })
        .fail(xhr => {
            console.error(xhr);
            console.error("Erro na requisição:", xhr.responseJSON || xhr.responseText);
            const msg = xhr.responseJSON?.message || "Erro desconhecido.";
            $("#saida").html(`<div>❌ Erro ${xhr.status}: ${msg}</div>`);
        })
        .always(() => {
            esconderLoader();
        });
}); // funcionando

$("#buttonUpdateProducts").on("click", function (e) {
    const token = getItem("authToken");
    const shop_id = Number($("#updateProductId").val());
    const product_name = $("#updateProductName").val();
    const description = $("#updateProductDescription").val().trim();
    const price = parseFloat($("#updateProductPrice").val());
    const product_type = $("#updateProductType").val();
    const quantity = Number($("#updateProductQuantity").val());

    const produto = { shop_id, product_name, description, price, product_type, quantity };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/products/${shop_id}`,
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
}); // funcionando

$("#buttonDelleteProducts").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#deleteProductId").val();
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "DELETE",
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
}); // funcionando

$("#buttonGetShopProducts").on("click", function (e) {
    const token = getItem("authToken");
    const shopId = $("#shopProductsId").val();
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
                // Insert into the div
                console.log("Payload:" + res[0]);
                const rulesHtml = res.map(rule => `
                        <div class="rule-item">
                            <p>${rule.description ?? "Não tem descrição."}</p>
                        </div>
                    `).join("");

                $("#shopProductsList").html(rulesHtml);

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