function loadComponentByClass(className, filePath) {
  return new Promise((resolve, reject) => {
    const selector = `.${className}`;
    $(selector).load(`${filePath} ${selector}`, function (response, status, xhr) {
      if (status === "error") {
        console.error(`Erro ao carregar ${filePath}:`, xhr.status, xhr.statusText);
        reject(xhr);
      } else {
        resolve();
      }
    });
    window.loadComponentByClass = loadComponentByClass;
  });
}