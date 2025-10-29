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

$("#btnPostMessages").on("click", function (e) {
    const token = getItem("authToken");
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: "https://connectcond-backend.onrender.com/public",
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify({}), // Pode adicionar filtros se quiser
        dataType: "json"
    })
        .done(function (res) {
            try {
                console.log("💬 Mensagens carregadas:", res);
                $("#messages").empty();

                if (Array.isArray(res) && res.length > 0) {
                    res.forEach(msg => {
                        $("#chatGeneralBox").append(`
                            <div class="msg">
                                <strong>${msg.author_name || "Usuário"}:</strong> ${msg.text}
                            </div>
                        `);
                    });
                } else {
                    $("#saida").html("<em>Nenhuma mensagem encontrada.</em>");
                }

                $("#saida").html("<div>✅ Mensagens carregadas com sucesso!</div>");
            } catch (error) {
                console.error("Erro no processamento:", error);
                $("#saida").html("<div>⚠️ Erro inesperado. Tente novamente.</div>");
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

// 📩 Enviar mensagem pública
$("#buttonPostChatMessage").on("click", function (e) {
    const token = getItem("authToken");
    const text = $("#chatGeneralInput").val().trim();
    e.preventDefault();
    mostrarLoader();

    if (!text) {
        alert("Digite uma mensagem antes de enviar.");
        esconderLoader();
        return;
    }

    $.ajax({
        type: "POST",
        url: "https://connectcond-backend.onrender.com/public/message",
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify({ text }),
        dataType: "json"
    })
        .done(function (res) {
            try {
                console.log("📨 Mensagem enviada:", res);

                $("#chatGeneralInput").val(""); // Limpa o input

                $("#saida").html("<div>✅ Mensagem enviada com sucesso!</div>");

                // Atualiza as mensagens se a função existir
                if (typeof loadPublicMessages === "function") {
                    loadPublicMessages();
                }
            } catch (error) {
                console.error("Erro no processamento:", error);
                $("#saida").html("<div>⚠️ Erro inesperado. Tente novamente.</div>");
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