function loadComponentByClass(className, filePath) {
  $(function () {
    const selector = `.${className}`;
    $(selector).load(`${filePath} ${selector}`);
  });
}