function theme() {
    const btn = document.getElementById("theme-btn");
    const body = document.body;
    const btnD = document.getElementById('toggle');
    const menu = document.getElementById('menu');

    btnD.addEventListener('click', () => menu.classList.toggle('show'));

    document.addEventListener('click', e => {
        if (!e.target.closest('.menu')) menu.classList.remove('show');
    });

    // Carregar preferência salva
    if (localStorage.getItem("theme") === "dark") {
        body.setAttribute("data-theme", "dark");
        btn.textContent = "☀️";
    }

    // Alternar tema via botão
    btn.addEventListener("click", () => {
        if (body.getAttribute("data-theme") === "dark") {
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
            const root = document.documentElement;
            const currentTheme = root.dataset.theme === "dark" ? "light" : "dark";
            root.dataset.theme = currentTheme;
            localStorage.setItem("theme", currentTheme);
            btn.textContent = currentTheme === "dark" ? "☀️" : "🌙";
        }
    });
}