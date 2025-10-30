let loaderStartTime = null;
let loaderVisible = false;
let loaderCanHide = false;  // controla se o tempo mínimo já passou

export function showLoader() {
  loaderStartTime = Date.now();
  loaderVisible = true;
  loaderCanHide = false;

  const div = document.getElementById("loader");
  if (div) div.style.display = "flex";

  setTimeout(() => {
    loaderCanHide = true;
    if (!loaderVisible) {  // se a requisição já acabou, esconde o loader
      const div = document.getElementById("loader");
      if (div) div.style.display = "none";
    }
  }, 1500);
}

export function hideLoader() {
  loaderVisible = false;
  if (loaderCanHide) {
    const div = document.getElementById("loader");
    if (div) div.style.display = "none";
  }
}