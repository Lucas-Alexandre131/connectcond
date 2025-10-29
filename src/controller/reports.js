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

$("#buttonPostReports").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#idProduto").val();
    const horario = { id };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/reports`,
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
}); // funcionando(Não)

$("#buttonGetReports").on("click", function (e) {
    const token = getItem("authToken");
    const status = $("#filterReportStatus").val()
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/reports`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(status),
        dataType: "json"
    })
        .done(function (res) {
            try {
                console.log("Payload completo:", JSON.stringify(res, null, 2));

                // Garante que sempre temos um array
                const reports = Array.isArray(res) ? res : [];

                if (reports.length === 0) {
                    $("#reportsList").html(`
                <div class="no-results">
                    💤 Nenhum chamado encontrado.
                </div>
            `);
                    return;
                }

                const reportsHtml = reports.map(report => `
            <div class="rule-item">
                <p><strong>Número:</strong> ${report.id}</p>   
                <p><strong>Título:</strong> ${report.title}</p>
                <p><strong>Descrição:</strong> ${report.text || "Sem descrição"}</p>
                <p><strong>Status:</strong> ${report.status}</p>
                <hr>
                ${report.path ? `<img src="${report.path}" alt="Anexo" class="report-img" />` : ""}
            </div>
        `).join("");

                $("#reportsList").html(reportsHtml);

            } catch (error) {
                console.error("Erro no processamento dos relatórios:", error);
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

$("#buttonUpdateReports").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#updateReportId").val();
    const title = $("#reportTitlePut").val();
    const text = $("#reportTextPut").val();
    const path = $("#pathPut").val();
    const status = $("#updateReportStatus").val();
    const reports = { title, text, path, status }
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/reports/${id}/status`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(reports),
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