FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the Angular dev server port
EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
