import { handleHttpResponse } from "../controller/errors/handleHttpResponse.js";
import { showLoader, hideLoader } from "../services/showSvg.js";
import { getItem } from "../controller/cookie/authCookie.js";
import { limparSaida, processarLoginErro, processarLoginSucesso, lidarComErroGeral } from "../services/login.js";
import { errorMessage } from "../services/errorMessage.js";

$("#buttonLogin").on("click", function (e) {
    e.preventDefault();

    if (!this.checkValidity()) {
        this.reportValidity();
        return;
    }// validação de dados fornecidos no form

    const email = $("#email").val();
    const password = $("#password").val();
    const saida = $("#saida");

    limparSaida(saida);
    showLoader();

    $.ajax({
        type: "POST",
        url: "https://connectcond-backend.onrender.com/login",
        contentType: "application/json",
        data: JSON.stringify({ email, password }),
        dataType: "json"
    })
        .done(function (res) {
            try {
                const resultado = handleHttpResponse(res);

                const token = res?.token;

                if (token) {
                    processarLoginSucesso(token, saida);
                } else {
                    processarLoginErro(resultado, saida);
                }
            } catch (error) {
                lidarComErroGeral(error);
            } finally {
                hideLoader();
            }
        })
        .fail(function (xhr) {
            errorMessage(xhr.status);
            const resultado = handleHttpResponse(null, xhr);
            $("#saida").text(`Erro: ${resultado.mensagem}`);
            hideLoader();
        });
});