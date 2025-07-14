$(document).ready(function () {
    $("#btnLogIn").on("click", function () {
        const email = $("#email").val();
        const password = $("#password").val();
        $.ajax({
            type: "POST",
            url: "http://localhost:9000/login",
            contentType: "application/json",
            data: JSON.stringify({
                email, password
            }),
            dataType: "json"
        })
            .done(function (res) {
                console.log("Resposta do servidor: ", res); // resposta do servidor.
            })
            .fail(function (xhr, status, error) {
                console.error("Erro:", { status: status, erro: error, resposta: xhr.responseText }); // resposta do servidor.
            })
    })
});