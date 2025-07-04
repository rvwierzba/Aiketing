# client/Dockerfile
# Etapa 1: Instalar dependências
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Usamos --frozen-lockfile para garantir que as versões exatas do package-lock sejam usadas
RUN npm ci

# Etapa 2: Construir o projeto
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Adicionamos a variável de ambiente para a URL da API durante o build
ARG NEXT_PUBLIC_API_BASE_URL=http://backend:8080
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
RUN npm run build

# Etapa 3: Preparar a versão final para produção
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia os arquivos da build para a imagem final
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

# Comando para iniciar o servidor otimizado
CMD ["node", "server.js"]
