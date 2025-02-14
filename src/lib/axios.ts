import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Accept": "application/vnd.api+json",
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token JWT dos cookies ao header Authorization
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Pegando o token do cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.error("Token inválido ou expirado. Redirecionando para login...");
        Cookies.remove("token"); // Remove o token do cookie
        if (typeof window !== "undefined") {
          window.location.href = "/login"; // Redireciona para login
        }
      } else if (status === 403) {
        console.error("Acesso negado.");
      } else if (status === 404) {
        console.error("Recurso não encontrado.");
      } else if (status === 415) {
        console.error("Tipo de mídia não suportado.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
