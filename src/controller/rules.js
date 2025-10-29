import { handleHttpResponse } from "../controller/errors/handleHttpResponse.js";
import { getItem, setItem } from "../controller/cookie/authCookie.js";
import { errorMessage } from "../services/errorMessage.js";

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

$("#buttonGetRules").on("click", function (e) {
    const token = getItem("authToken");
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: "https://connectcond-backend.onrender.com/rules",
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json"
    })
        .done(function (res) {
            try {
                // Insert into the div
                console.log(res);
                const rulesHtml = res.map(rule => `
                <div class="rule-item">
                    <p><strong>Número da regra: </strong> ${rule.id}</p>
                    <p><strong>Descrição: </strong> ${rule.description || "Não informada"}</p>
                    <hr>
                </div>
            `).join("");

                $("#rulesList").html(rulesHtml);

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
});
$("#buttonPostRules").on("click", function (e) {
    e.preventDefault();
    const token = getItem("authToken");
    const description = $("#ruleDescription").val();

    mostrarLoader();

    $.ajax({
        type: "POST",
        url: "https://connectcond-backend.onrender.com/rules",
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify({ description })
    })
        .done(function (res) {
            alert("✅ Regra criada com sucesso!");
            $("#ruleDescription").val(""); // limpa o campo
            $("#buttonRules").click(); // recarrega lista de regras
        })
        .fail(function (xhr) {
            errorMessage(xhr.status);
        })
        .always(function () {
            esconderLoader();
        });
});

$("#buttonUpdateRules").on("click", function (e) {
    e.preventDefault();
    const token = getItem("authToken");
    const id = $("#ruleId").val(); // ID da regra a atualizar
    const description = $("#ruleDescription").val();

    if (!id) {
        alert("Informe o ID da regra que deseja atualizar!");
        return;
    }

    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/rules/${id}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify({ description })
    })
        .done(function (res) {
            alert("✏️ Regra atualizada com sucesso!");
            $("#buttonRules").click(); // recarrega lista
        })
        .fail(function (xhr) {
            errorMessage(xhr.status);
        })
        .always(function () {
            esconderLoader();
        });
});
$("#buttonDeletteRules").on("click", function (e) {
    e.preventDefault();
    const token = getItem("authToken");
    const id = $("#ruleId").val();

    if (!id) {
        alert("Informe o ID da regra que deseja excluir!");
        return;
    }

    if (!confirm("Tem certeza que deseja deletar esta regra?")) return;

    mostrarLoader();

    $.ajax({
        type: "DELETE",
        url: `https://connectcond-backend.onrender.com/rules/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .done(function (res) {
            console.log(res + "🗑️ Regra removida com sucesso!");
            $("#buttonRules").click(); // recarrega lista
        })
        .fail(function (xhr) {
            errorMessage(xhr.status);
        })
        .always(function () {
            esconderLoader();
        });
});