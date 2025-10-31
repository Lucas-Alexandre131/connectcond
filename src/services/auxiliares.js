import { setItem } from "../controller/cookie/authCookie.js";

export function limparSaida(saida) {
  saida.empty();
}

export function exibirMensagem(saida, mensagem) {
  saida.html(`
    <div>
      ${mensagem}
    </div>
  `);
}

export function exibirMensagemErro(saida, mensagem) {
  saida.html(`
    <div class="login-error">
      ${mensagem}
    </div>
  `);
}

export function exibirMensagemInfo(saida, mensagem) {
  saida.html(`
    <div class="login-info">
      ${mensagem}
    </div>
  `);
}

export function processarLoginSucesso(token, saida) {
  try {
    setItem("authToken", token);
  } catch (err) {
    console.error("Erro ao salvar token:", err);
  }

  setTimeout(() => {
    window.location.href = "/src/pages/syndic.html";
  }, 1500);
}

export function processarLoginErro(resultado, saida) {
  const msgErro =
    typeof resultado === "string"
      ? resultado
      : JSON.stringify(resultado, null, 2);

  exibirMensagemErro(saida, `⚠️ Falha no login.<br>${msgErro}`);
}

export function lidarComErroGeral(error) {
  console.error("Erro ao processar login:", error);
  const saida = $("#saida");
  exibirMensagemErro(saida, "❌ Ocorreu um erro inesperado. Tente novamente.");
}

export function exibirRes(res){
  const saida = $("#saida");
  exibirMensagem(saida, res);
}