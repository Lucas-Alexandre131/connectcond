
$(document).ready(function () {
    $("#buttonSing").on("click", function (e) {
        e.preventDefault();
        const email = $("#email").val();
        const password = $("#password").val();
        const name = $("#name").val();
        const cpf = $("#cpf").val();
        const role = $("#role").val();
        const condo_id = "";// ver isso depois
        const picture = ""; // ver isso depois
        $.ajax({
            type: "POST",
            url: "http://localhost:9000/account",
            contentType: "application/json",
            data: JSON.stringify({
                email, password, name, cpf, role, condo_id, picture
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