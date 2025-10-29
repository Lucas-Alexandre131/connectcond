function theme() {
    const body = document.body;

    const btn = document.getElementById("theme-btn");
    const btnD = document.getElementById('toggle');
    const menu = document.getElementById('menu');

    // Menu dropdown
    if (btnD && menu) {
        btnD.addEventListener('click', () => menu.classList.toggle('show'));

        document.addEventListener('click', e => {
            if (!e.target.closest('.menu')) menu.classList.remove('show');
        });
    }

    // Se não existe botão de tema, sai da função
    if (!btn) return;

    // Carregar preferência salva
    if (localStorage.getItem("theme") === "dark") {
        body.setAttribute("data-theme", "dark");
        btn.textContent = "☀️";
    } else {
        body.removeAttribute("data-theme");
        btn.textContent = "🌙";
    }

    // Alternar tema via botão
    btn.addEventListener("click", () => {
        const isDark = body.getAttribute("data-theme") === "dark";
        if (isDark) {
            body.removeAttribute("data-theme");
            btn.textContent = "🌙";
            localStorage.setItem("theme", "light");
        } else {
            body.setAttribute("data-theme", "dark");
            btn.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        }
    });

    // Alternar tema com tecla "T"
    document.addEventListener('keydown', e => {
        if (e.key && e.key.toLowerCase() === 't') {
            const currentTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
            body.setAttribute("data-theme", currentTheme);
            localStorage.setItem("theme", currentTheme);
            btn.textContent = currentTheme === "dark" ? "☀️" : "🌙";
        }
    });
}