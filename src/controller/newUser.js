import { handleHttpResponse } from "../controller/errors/handleHttpResponse.js";
import { errorMessage } from "../services/errorMessage.js";
import { getItem } from "../controller/cookie/authCookie.js";
import { lidarComErroGeral } from "../services/auxiliares.js";
import { showLoader, hideLoader } from "../services/showSvg.js";
import { showError } from "./errors/errorHandle.js";


$(document).ready(function () {
    const $btn = $("#btnCadastro");
    const token = getItem('authToken');

    if (!$btn.length) {
        console.warn("Botão de cadastro não encontrado.");
        return;
    }

    $btn.on("click", function (e) {
        e.preventDefault();

        const cpf = $("#cpf").val().replace(/\D/g, '');
        const role = $("#role").val();
        const password = $("#password").val();
        const name = $("#name").val();
        const email = $("#email").val();
        const picture = $("#picture").val();

        const userData = { cpf, role, password, name, email, picture };
        showLoader();
        console.log("Dados:", userData);

        if (!userData) {
            errorMessage(userData);
            hideLoader();
            return;
        }
        console.log("Dados:", userData);

        $.ajax({
            type: "POST",
            url: "https://connectcond-backend.onrender.com/account",
            contentType: "application/json",
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: JSON.stringify(userData),
            dataType: "json"
        })
            .done(function (res) {
                try {
                    const resultado = handleHttpResponse(res);
                    if (!resultado) {
                        console.log(resultado.message);
                    }
                    return res;
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
});