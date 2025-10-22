export function errorMessage(status) {
  switch(status) {
    case 400:
      return "Requisição inválida. Por favor, verifique os dados enviados.";
    case 401:
      return "Não autorizado. Faça login para continuar.";
    case 403:
      return "Acesso negado. Você não tem permissão para acessar este recurso.";
    case 404:
      return "Recurso não encontrado. Verifique a URL ou tente novamente mais tarde.";
    case 500:
      return "Erro interno do servidor. Tente novamente mais tarde.";
    case 503:
      return "Serviço indisponível. O servidor está temporariamente fora do ar.";
    default:
      return `Erro inesperado (código: ${status}). Por favor, tente novamente.`;
  }
}