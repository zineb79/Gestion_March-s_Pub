# Étape 1 : Build de l'application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Image de production
FROM node:20-alpine

WORKDIR /app

RUN npm install -g http-server

# Correction ici : spécifiez le chemin complet
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Correction : pointez vers le dossier dist
CMD ["http-server", "dist", "-p", "3000"]