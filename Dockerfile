# 1. Builder l'app
FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Servir les fichiers avec Nginx
FROM nginx:stable-alpine

# Copie du build vers nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer ton port (87)
EXPOSE 87

# Modifier le port par défaut de Nginx
RUN sed -i 's/listen 80;/listen 87;/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
