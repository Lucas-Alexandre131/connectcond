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

$("#buttonPostVehicles").on("click", function (e) {
    const token = getItem("authToken");
    const plate = $("#vehiclePlate").val();
    const model = $("#vehicleModel").val();
    const color= $("#vehicleColor").val();
    const vehicle = { plate,model,color };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "POST",
        url: `https://connectcond-backend.onrender.com/vehicles`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(vehicle),
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

$("#buttonGetVehicles").on("click", function (e) {
    const token = getItem("authToken");
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "GET",
        url: `https://connectcond-backend.onrender.com/vehicles/my`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        dataType: "json"
    })
        .done(function (res) {
            try {
                // Insert into the div
                console.log("Payload:", res);

                if (!res || !Array.isArray(res)) {
                    console.warn("Payload inválido ou vazio");
                    $("#vehiclesList").html("<div>❌ Nenhum veículo encontrado.</div>");
                    return;
                }

                const vehiclesHtml = res.map(vehicle => `
        <div>${vehicle.name}</div>
    `).join("");

                $("#vehiclesList").html(vehiclesHtml);

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
            console.error("Erro na requisição:", xhr.responseJSON || xhr.responseText);
            const responseText = xhr.responseJSON?.message || "Erro desconhecido.";
            $("#saida").html(`<div>❌ Erro ${xhr.status}: ${responseText}</div>`);
            esconderLoader();
        });
}); // funcionando(teste)

$("#buttonUpdateVehicles").on("click", function (e) {
    const token = getItem("authToken");
    const id = $("#deleteVehicleId").val();
    const plate = $("#updateVehiclePlate").val();
    const model = $("#updateVehicleModel").val();
    const color= $("#updateVehicleColor").val();
    const vehicle = { plate,model,color };
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "PUT",
        url: `https://connectcond-backend.onrender.com/vehicles/${id}`,
        contentType: "application/json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(vehicle),
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

$("#buttonDeletteVehicles").on("click", function (e) {
    const token = getItem("authToken");
    const id = Number($("#deleteVehicleId").val());
    e.preventDefault();
    mostrarLoader();

    $.ajax({
        type: "DELETE",
        url: `https://connectcond-backend.onrender.com/vehicles/${id}`,
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