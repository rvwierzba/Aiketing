# client/Dockerfile
# Etapa 1: Instalar dependências
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# Etapa 2: Construir o projeto
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Definir variáveis de ambiente para o build
ARG NEXT_PUBLIC_API_BASE_URL=http://backend:8080
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Verificar se os arquivos necessários estão presentes
RUN ls -la && \
    ls -la locales/ && \
    ls -la components/

# Instalar dependências necessárias para o build
RUN apk add --no-cache git

# Executar o build
RUN npm run build

# Etapa 3: Preparar a versão final para produção
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copiar apenas os arquivos necessários
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/locales ./locales

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]