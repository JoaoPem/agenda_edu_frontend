# Etapa 1: Construção
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas arquivos essenciais para otimizar cache
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install --frozen-lockfile

# Copia o restante do código
COPY . .

# Constrói a aplicação Next.js
RUN npm run build

# Remove dependências de desenvolvimento para otimizar a imagem
RUN npm prune --production

# Etapa 2: Execução
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos necessários da build
COPY --from=builder /app/package.json /app/package-lock.json* /app/yarn.lock* /app/pnpm-lock.yaml* ./
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/src /app/src
COPY --from=builder /app/node_modules /app/node_modules

# Expõe a porta correta
EXPOSE 3001

# Comando para rodar o servidor Next.js
CMD ["npm", "run", "start", "--", "-p", "3001"]
