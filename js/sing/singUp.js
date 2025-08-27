
$(document).ready(function () {
    $("#buttonSing").on("click", function (e) {
        e.preventDefault();
        const email = $("#email").val();
        const password = $("#password").val();
        const name = $("#name").val();
        const cpf = $("#cpf").val();
        const role = $("#role").val();
        const condo_id = $("#condo_id").val();
        const picture = ""; // informações serão configuradas a nivel de banco ou back
        $.ajax({
            type: "POST",
            url: "http://localhost:9000/account",
            contentType: "application/json",
            data: JSON.stringify({ email, password, name, cpf, role, condo_id, picture }),
            dataType: "json"
        })
            .done(function (data) {
                if (!data.success) {
                    alert(data.message || 'Erro desconhecido');
                    return;
                }
                console.log('Conta criada com sucesso!');
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Erro HTTP:', jqXHR.status);
                console.error('Resposta bruta:', jqXHR.responseText);

                let message = 'Erro desconhecido';
                try {
                    const json = JSON.parse(jqXHR.responseText);
                    message = json.message || message;
                } catch (e) {
                    console.error(e);
                    console.warn('Não foi possível fazer parse da resposta como JSON');
                }

                alert(message);
            });
    });
});