import { handleHttpResponse } from "../controller/errors/handleHttpResponse.js";
import { errorMessage } from "../services/errorMessage.js";
import { getItem } from "../controller/cookie/authCookie.js";
import { exibirRes, lidarComErroGeral } from "../services/auxiliares.js";
import { showLoader, hideLoader } from "../services/showSvg.js";
import { showError } from "./errors/errorHandle.js";
import { exibirMensagens } from "../services/images.js";

$("#btnPostMessages").on("click", function (e) {
    const token = getItem("authToken");
    e.preventDefault();
    showLoader();

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
                exibirMensagens(res);
            } catch (error) {
                lidarComErroGeral(error);
            } finally {
                hideLoader();
            }
        })
        .fail(function (xhr) {
            errorMessage(xhr.status);
            const resultado = handleHttpResponse(null, xhr);
            showError(resultado.mensagem || 'Erro desconhecido.');
            hideLoader();
        });
});
// 📩 Pegar mensagem pública

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
// 📩 Enviar mensagem pública