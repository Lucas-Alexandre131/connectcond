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

$("#buttonPostPets").on("click", function (e) {
    const token = getItem("authToken");
    const name = $('#petName').val();
    const type = $('#petType').val();
    const animal = { name, type }
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: `https://connectcond-backend.onrender.com/pets`,
        contentType: "application/json",
        headers: { Authorization: `Bearer ${token}` },
        data: JSON.stringify(animal),
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
                    return;
                }

                const petsHtml = pets.map(pet => `
                <div class="rule-item">
                    <p><strong>Nome:</strong> ${pet.name}</p>
                    <p><strong>Espécie:</strong> ${pet.species || "Não informada"}</p>
                    <p><strong>Raça:</strong> ${pet.breed || "Não informada"}</p>
                    <p><strong>Porte:</strong> ${pet.size || "Não informado"}</p>
                </div>
            `).join("");

                $("#petsList").html(petsHtml);

            } catch (error) {
                console.error("Erro no processamento dos pets:", error);
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
});// funcionando

$("#buttonGetPets").on("click", function (e) {
    const token = getItem("authToken");
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/pets/my`,
        contentType: "application/json",
        headers: { Authorization: `Bearer ${token}` },
        dataType: "json"
    })
    .done(function (res) {
        try {
            console.log("Payload completo:", JSON.stringify(res, null, 2));

            // Se res for null, transforma em array vazio
            const pets = res ? (Array.isArray(res) ? res : (res.pets || [])) : [];

            if (pets.length === 0) {
                $("#petsList").html(`
                    <div class="no-results">
                        🐾 Nenhum pet cadastrado ainda.
                    </div>
                `);
                return;
            }

            const petsHtml = pets.map(pet => `
                <div class="rule-item">
                    <p><strong>Nome:</strong> ${pet.name}</p>
                    <p><strong>Espécie:</strong> ${pet.type || "Não informada"}</p>
                    <hr>
                </div>
            `).join("");

            $("#petsList").html(petsHtml);

        } catch (error) {
            console.error("Erro no processamento dos pets:", error);
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
}); // funcionando

$("#buttonUpdatePets").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#updatePetId").val();
    const type = $("#updatePetType").val();
    const name = $("#updatePetName").val();
    const animal = { type, name };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/pets/${id}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(animal),
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

$("#buttonDelettePets").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#deletePetId").val();
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "DELETE",
        url: `https://connectcond-backend.onrender.com/pets/${id}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
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