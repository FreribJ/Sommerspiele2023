# Verwende einen offiziellen Node.js-Image als Basis
FROM node:22-alpine

# Lege das Arbeitsverzeichnis innerhalb des Containers fest
WORKDIR /usr/src/app

# Kopiere den Rest der Anwendung in das Arbeitsverzeichnis
COPY . .

RUN npm install

# Der Standard-Port für die Anwendung
EXPOSE 1234

# Starte die Anwendung
CMD ["node", "main.js"]
