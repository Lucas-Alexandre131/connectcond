/**
 * Exibe uma mensagem de erro dentro do modal ativo
 * @param {string} mensagem - texto do erro
 */
export function showError(mensagem) {
  const modalAtivo = document.querySelector('.modal.active');

  if (modalAtivo) {
    let saida = modalAtivo.querySelector('.saida');

    if (!saida) {
      saida = document.createElement('div');
      saida.className = 'saida';
      modalAtivo.querySelector('.modal-content').appendChild(saida);
    }

    saida.textContent = mensagem;
    saida.style.display = 'block';
    saida.style.opacity = '1';

    clearTimeout(saida._timer);
    saida._timer = setTimeout(() => {
      saida.style.opacity = '0';
      setTimeout(() => (saida.style.display = 'none'), 300);
    }, 4000);
  } else {
    console.warn('Nenhum modal ativo para exibir erro:', mensagem);
  }
}