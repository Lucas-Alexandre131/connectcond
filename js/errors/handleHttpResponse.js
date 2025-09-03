// Objeto com todos os códigos HTTP
const errorsHttp = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "103": "Early Hints",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a Teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Too Early",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
};

// Função genérica para tratar erro em AJAX (jQuery)
function tratarErro(resposta, xhr = null) {
  // Caso venha do servidor como objeto (resposta JSON)
  if (resposta && typeof resposta === "object" && resposta.status) {
    if (resposta.status === "error") {
      const mensagemErro = resposta.erro && resposta.erro.trim() !== ""
        ? resposta.erro
        : "Ocorreu um erro desconhecido no servidor.";

      return {
        status: "error",
        mensagem: mensagemErro,
        resposta: resposta.resposta ?? null
      };
    }

    return {
      status: "success",
      mensagem: "Requisição concluída com sucesso.",
      resposta: resposta.resposta ?? null
    };
  }

  // Caso venha do jQuery (xhr)
  if (xhr) {
    const mensagemErro = errorsHttp[xhr.status]
      ? `${errorsHttp[xhr.status]} (${xhr.status})`
      : `Erro desconhecido na requisição (HTTP ${xhr.status}).`;

    return {
      status: "error",
      mensagem: mensagemErro,
      resposta: null
    };
  }

  return {
    status: "error",
    mensagem: "Erro inesperado.",
    resposta: null
  };
}