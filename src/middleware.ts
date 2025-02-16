import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Verifica se a URL atual é a raiz "/"
  if (request.nextUrl.pathname === "/") {
    // Redireciona para "/tasks"
    return NextResponse.redirect(new URL("/tasks", request.url));
  }

  // Continua a execução para outras rotas
  return NextResponse.next();
}

// Define as rotas onde o middleware será aplicado
export const config = {
  matcher: ["/"], // Aplica o middleware apenas na rota "/"
};
