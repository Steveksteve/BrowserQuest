FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json avant tout
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Exposer le port de l'app
EXPOSE 8000

# Commande par défaut
CMD ["node", "server/server.js"]
