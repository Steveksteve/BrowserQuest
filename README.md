# 🎮 BrowserQuest – Docker Edition

### 👩‍💻 Projet réalisé par :
**Katia Sakri**  
**Ryan Annic**

---

## 🧾 Description

Reprise, correction et déploiement Docker du projet **BrowserQuest**, un MMORPG open-source développé à l’origine par Mozilla.

Ce projet avait pour objectif de remettre en état l’application Node.js d’origine, corriger les erreurs techniques, et réaliser un déploiement Docker fonctionnel.

---

## 🚧 Travaux réalisés

- 🔁 Renommage de `map.js` en `themap.js` pour éviter les conflits avec `.map()` en JavaScript
- 🔁 Remplacement des références `map.` par `theMap.`
- 🧠 Ajout du bon export `Map = require('./themap')`
- 🎵 Ajout des fichiers audio dans `client/audio/sound`
- 🧩 Création du fichier `server.js` pour servir de point d'entrée au serveur
- ⚙️ Ajout du support WebSocket (`ws`)
- 🐳 Ajout des fichiers `Dockerfile` et `docker-compose.yml`
- 🔧 Résolution des erreurs de module et de lancement

---

## 🐳 Lancer le projet avec Docker

### Étapes :

```bash
git clone https://github.com/Steveksteve/Browserquest.git
cd Browserquest
docker-compose up --build

