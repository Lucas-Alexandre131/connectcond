function moveButton() {
  const btn = document.getElementById('buttonSing');
  const form = document.getElementById('form');
  const leftPanel = document.getElementById('left');

  if (window.innerWidth <= 480 || window.innerWidth <=600 || window.innerWidth <=800) {
    // Se estiver no mobile e o botão ainda não estiver no form
    if (form && !form.contains(btn)) {
      form.appendChild(btn);
    }
  } else {
    // Se estiver em telas maiores e o botão não estiver no left-panel
    if (leftPanel && !leftPanel.contains(btn)) {
      leftPanel.appendChild(btn);
    }
  }
}

// Rodar quando a página carrega e sempre que redimensionar
window.addEventListener('DOMContentLoaded', moveButton);
window.addEventListener('resize', moveButton);