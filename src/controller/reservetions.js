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

$("#buttonPostReservetions").on("click", function (e) {
    const token = getItem("authToken");
    const special_hall_id = Number($("#reservationCreateHallId").val());
    const start_time = String($("#reservationPostStartTime").val());
    const end_time = String($("#reservationEndTime").val());
    const horario = { special_hall_id, start_time, end_time };
    console.log("Payload enviado:", horario);
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: `https://connectcond-backend.onrender.com/reservations`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(horario),
        dataType: "json"
    })
        .done(function (res) {
            try {
                const resultado = handleHttpResponse(res.special_hall_id);

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

$("#buttonUpdateReservetions").on("click", function (e) {
    const token = getItem("authToken");
    const special_hall_id = Number($("#statusReservationHallId").val());
    const status = $("#reservationStatus").val();
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/reservations/:${special_hall_id}/status`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(status),
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

$("#buttonGetReservitions").on("click", function (e) {
    const token = getItem("authToken");
    const hallId = $("#hallId").val();
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/reservations/hall/${hallId}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json"
    })
        .done(function (res) {
            console.log("Resposta da API:", res);

            try {
                // Garante que 'res' nunca seja null
                const data = res || {};
                const reservations = data.reservations || [];

                if (reservations.length === 0) {
                    $("#reservationListContent").html(`
                <div class="no-results">
                    💤 Nenhuma reserva encontrada para esta área.
                </div>
            `);
                    return;
                }

                const rulesHtml = reservations.map(reserva => `
            <div class="rule-item">
                <p><strong>ID:</strong> ${reserva.id}</p>
                <p><strong>Descrição:</strong> ${reserva.description || 'Sem descrição'}</p>
                <p><strong>Início:</strong> ${new Date(reserva.start_time).toLocaleString()}</p>
                <p><strong>Término:</strong> ${new Date(reserva.end_time).toLocaleString()}</p>
            </div>
        `).join("");

                $("#reservationListContent").html(rulesHtml);

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