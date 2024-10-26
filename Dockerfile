# Étape de base avec l'image Node.js
FROM node:20.12.2-alpine3.18 AS base

# Étape des dépendances pour toutes les dépendances
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Étape des dépendances de production uniquement
FROM base AS production-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Étape de build
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN node ace build

# Étape de production finale
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

# Exécuter les migrations
RUN node ace migration:run --force

# Exposer le port
EXPOSE 8080

# Lancer le serveur
CMD ["node", "./bin/server.js"]
