import { handleHttpResponse } from "../controller/errors/handleHttpResponse.js";
import { errorMessage } from "../services/errorMessage.js";
import { getItem } from "../controller/cookie/authCookie.js";
import { exibirRes, lidarComErroGeral } from "../services/auxiliares.js";
import { showLoader, hideLoader } from "../services/showSvg.js";
import { showError } from "./errors/errorHandle.js";

$("#buttonGetRules").on("click", function (e) {
    const token = getItem("authToken");
    e.preventDefault();
    showLoader();

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
                const resultado = handleHttpResponse(res);
                if (!resultado) {
                    console.log(resultado.message);
                }
                const regras = res.map(item => item.description);
                exibirRes(regras);
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

$("#buttonPostRules").on("click", function (e) {
    e.preventDefault();
    const token = getItem("authToken");
    const description = $("#ruleDescription").val();

    showLoader();

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

$("#buttonUpdateRules").on("click", function (e) {
    e.preventDefault();
    const token = getItem("authToken");
    const id = $("#ruleId").val();
    const description = $("#ruleDescription").val();

    if (!id) {
        alert("Informe o ID da regra que deseja atualizar!");
        return;
    }

    showLoader();

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

$("#buttonDeletteRules").on("click", function (e) {
    e.preventDefault();
    const token = getItem("authToken");
    const id = $("#ruleId").val();

    if (!id) {
        alert("Informe o ID da regra que deseja excluir!");
        return;
    }

    if (!confirm("Tem certeza que deseja deletar esta regra?")) return;

    showLoader();

    $.ajax({
        type: "DELETE",
        url: `https://connectcond-backend.onrender.com/rules/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
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