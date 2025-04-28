FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier les dossiers nécessaires
COPY server ./server
COPY shared ./shared
COPY client ./client

# Port exposé (le port utilisé par ton serveur Node.js)
EXPOSE 8000

# Lancer le serveur
CMD ["node", "server/server.js"]
