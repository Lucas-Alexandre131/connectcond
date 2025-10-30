export function errorMessage(texto) {
  const saidas = document.querySelectorAll('.saida');
  saidas.forEach(msg => {
    msg.textContent = texto;
    msg.style.display = "flex";
  });
}