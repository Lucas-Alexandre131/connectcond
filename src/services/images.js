export function exibirMensagens(res) {
    const container = document.getElementById("chatGeneralBox");
    if (!container) {
        console.error("❌ Elemento #chatGeneralBox não encontrado.");
        return;
    }

    // Limpa conteúdo anterior com segurança
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    if (Array.isArray(res) && res.length > 0) {
        const fragment = document.createDocumentFragment();

        res.forEach(msg => {
            const divMsg = document.createElement("div");
            divMsg.classList.add("msg");

            // --- Foto do autor ---
            const img = document.createElement("img");
            img.classList.add("msg__foto");
            img.alt = msg.author_name || "Usuário";
            img.src = msg.author_picture?.startsWith("http")
                ? msg.author_picture
                : "default-avatar.png";
            img.onerror = () => (img.src = "default-avatar.png");

            // --- Conteúdo (nome, texto, hora) ---
            const content = document.createElement("div");
            content.classList.add("msg-content");

            // Nome
            const strong = document.createElement("strong");
            strong.textContent = (msg.author_name || "Usuário") + ":";

            // Texto
            const texto = document.createElement("span");
            texto.classList.add("msg__texto");
            texto.textContent = msg.text ?? "";

            // Hora (formata caso seja uma string de data ISO)
            const hora = document.createElement("span");
            hora.classList.add("msg__hora");
            if (msg.created_at) {
                const data = new Date(msg.created_at);
                const horas = String(data.getHours()).padStart(2, "0");
                const minutos = String(data.getMinutes()).padStart(2, "0");
                hora.textContent = `${horas}:${minutos}`;
            } else {
                hora.textContent = ""; // caso não venha timestamp
            }

            // Montagem
            content.appendChild(strong);
            content.appendChild(texto);
            content.appendChild(hora);

            divMsg.appendChild(img);
            divMsg.appendChild(content);

            fragment.appendChild(divMsg);
        });

        container.appendChild(fragment);
    } else {
        const aviso = document.createElement("p");
        aviso.textContent = "Nenhuma mensagem disponível.";
        aviso.classList.add("msg--vazia");
        container.appendChild(aviso);
    }
}